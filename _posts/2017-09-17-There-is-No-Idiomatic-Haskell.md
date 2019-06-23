Haskell is the most expressive programming language that I have ever encountered. More than Clojure and other Lisps. More than any of the half dozen imperative languages I have had the trouble of dealing with. It manages to pull off this level of expressiveness with just a dozen or so special forms. I have never been as besotted with any other language.

However, Haskell has a very interesting trait. There is no idiomatic way of doing any8thing!

## Too Many Roads Leading to Rome

Consider the following problem from [exercism.io](http://exercism.io):

> Implement run-length encoding and decoding.
  Run-length encoding (RLE) is a simple form of data compression, where runs (consecutive data elements) are replaced by just one data value and count.
  For example we can represent the original 53 characters with only 13.
  "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB"  ->  "12WB12W3B24WB"
   RLE allows the original data to be perfectly reconstructed from the compressed data, which makes it a lossless data compression.
   "AABCCCDEEEE"  ->  "2AB3CD4E"  ->  "AABCCCDEEEE"
   For simplicity, you can assume that the unencoded string will only contain the letters A through Z (either lower or upper case) and whitespace. This way data to be encoded will never contain any numbers and numbers inside data to be decoded always represent the count for the following character.
   
The Haskell solution I (a beginner) came up with was this:

```haskell
module RunLength (decode, encode) where
import Data.Char (isLetter)

data RunLengthEncodingState = RunLengthEncodingState { 
        previousLetter      :: Char,
        previousLetterCount :: Int,
        encoded             :: String,
        pending             :: String
    } deriving (Show)

encodeNext :: RunLengthEncodingState -> RunLengthEncodingState
encodeNext currentState
    | not (null yetToEncode) = encodeNext ( currentState { previousLetter       = nextLetter,
                                                           previousLetterCount  = newLetterCount, 
                                                           pending              = remainder, 
                                                           encoded              = newEncoding } )
    | otherwise = currentState { encoded = newEncoding }
    where
        yetToEncode     = pending currentState
        currentLetter   = previousLetter currentState
        currentLetterStr
            | (isLetter currentLetter) || (currentLetter == ' ') = [currentLetter]
            | otherwise                                          = ""
        nextLetter
            | null yetToEncode = '\n'
            | otherwise        = head yetToEncode 
        prevCount       = previousLetterCount currentState
        remainder       = tail yetToEncode 
        prevEncode      = encoded currentState
        newLetterCount
            | currentLetter == nextLetter = prevCount + 1
            | otherwise                   = 1
        newSuffix
            | prevCount > 1            = (show prevCount)
            | otherwise                = ""
        newEncoding
            | (currentLetter /= nextLetter) = prevEncode ++ newSuffix ++ currentLetterStr
            | otherwise                     = prevEncode

encode :: String -> String
encode text = encoded (encodeNext (RunLengthEncodingState '\n' 0 "" text))

data RunLengthDecodingState = RunLengthDecodingState{
        currentCountStr  :: String,
        decoded          :: String,
        pendingDecode    :: String
    } deriving (Show)

decodeNext :: RunLengthDecodingState -> RunLengthDecodingState
decodeNext current
    | not (null (pendingDecode current)) = decodeNext (current { currentCountStr  = nextCountStr,
                                                                 decoded          = nextDecoded,
                                                                 pendingDecode    = nextPending })
    | otherwise = current
    where
        nextChar = head (pendingDecode current)
        hasCountEnded
            | isLetter nextChar || nextChar == ' '  = True
            | otherwise                             = False          
        nextCountStr
            | hasCountEnded = ""
            | otherwise     = (currentCountStr current) ++ [nextChar]
        newCount
            | (null (currentCountStr current)) = 1
            | otherwise                        = read (currentCountStr current) :: Int
        nextDecoded
            | hasCountEnded = (decoded current) ++ (take newCount (repeat nextChar))
            | otherwise     = (decoded current)
        nextPending = tail (pendingDecode current)

decode :: String -> String
decode encodedText = decoded (decodeNext (RunLengthDecodingState "" "" encodedText))
```

Ofcourse, you don't go to exercism/haskell just for the satisfaction of solving a problem. No, you go there to post a solution to gain access to other people's solutions to the same problem, and to then be utterly demoralized as you read solution after solution by other people that solves the problem in a fourth the number of lines of code as yours and twice the elegance:

For eg. consider the user `eraserhd`'s [solution to the same problem](http://exercism.io/submissions/0f7030b0fa6d456f9777f34820f010cc):

```haskell
module RunLength (decode, encode) where

import Control.Arrow ((&&&), (>>>))
import Data.Char (isDigit)
import Data.List (group)

decode          :: String -> String
decode ""       = ""
decode text@(c : cs)
  | isDigit c = let ((n, letter : rest) : _) = reads text
                in replicate n letter ++ decode rest
  | otherwise = c : decode cs

encode :: String -> String
encode = foldMap (length &&& head >>> encodeGroup) . group
  where
    encodeGroup (1, c) = [c]
    encodeGroup (n, c) = show n ++ [c]
```

Or [the solution from user `genos`](http://exercism.io/submissions/5ea4c9f3456243708dad33106049ca52):

```haskell
module RunLength (decode, encode) where

import Control.Arrow ((&&&))

import Data.Char     (isDigit)
import Data.List     (group)

encode :: String -> String
encode =
  concatMap (uncurry (++)) . fmap (show' . length &&& (:[]) . head) . group
  where show' n = if n == 1 then "" else show n

decode :: String -> String
decode [] = []
decode s  = replicate (read' i) (head s') ++ decode (tail s')
 where
  (i, s') = span isDigit s
  read' i = if i == "" then 1 else read i
```

However, after I got over the despair, I realized something much more startling:

Every solution was very different from every other!

These solutions were not just superficially different. They varied in the very fundamentals of the approach taken to solve the problem. Mine used a type to encapsulate state during the encode/decode cycle which was a tail recursive call. The more elegant solutions used variations of concatMap and folds. There was a remarkable diversity in the code to solve this problem.

My hunch was that such diversity would be missing in mainstream imperative solutions. So I checked out the solutions of the same problem in the Java track. I was right. They were all just some minor variation of [the following solution](http://exercism.io/submissions/2c83a1055a5147dab5d3b3543f3d3fb4):

```java
import java.util.Collections;

public class RunLengthEncoding {

    public String encode(String data) {
        return encode("", data);
    }

    private String encode(String stack, String data) {
        if (data.isEmpty()) {
            return stack;
        }

        String letter = data.substring(0, 1);
        String suffix = data.substring(1);
        int counter = 1;
        while (suffix.startsWith(letter)) {
            counter++;
            suffix = data.substring(counter);
        }

        if (counter == 1) {
            return encode(stack + letter, suffix);
        } else {
            return encode(stack + counter + letter, suffix);
        }
    }

    public String decode(String data) {
        if (data.isEmpty()) {
            return "";
        }

        int index = 0;
        char firstChar = data.charAt(index);
        if (Character.isAlphabetic(firstChar) || Character.isWhitespace(firstChar)) {
            return firstChar + decode(data.substring(1));
        }

        String number = "";
        while (Character.isDigit(data.charAt(index))) {
            number = data.substring(0, index++ + 1);
        }

        int count = Integer.parseInt(number);
        String letter = data.substring(index, index + 1);

        return String.join("", Collections.nCopies(count, letter)) + decode(data.substring(index + 1));
    }

}
```

You'd find a remarkable convergence even in the lines of code employed. 

I find this rather remarkable about Haskell. That you do the same thing in so many ways. But what do I know? Am just a beginner. I brought this on Haskell IRC only to get a clamour of agreement on this. One of the folks there even pointed me to the rather hilarious [Evolution of a Haskell Programmer](https://www.willamette.edu/~fruehr/haskell/evolution.html).

## Isn't this a good thing?

If you are regaling a OO programmer, trying to bedazzle him with the joys of what Haskell has to offer, absolutely. But once you have to start adopting it in enterprise, you will need to be able to achieve some level of standardization. For eg. imagine what the chaos in code review boards in your company if 3 of your programmers came up with 3 entirely different ways of doing something and all of them argue that theirs is the idiomatic approach to the problem.

Note that this is not just a matter of dispute resolution. Having canonical ways to do something also reduces the mental overhead to reading other people's code which you are going to do a lot of. 

Then there is the whole issue of effiency. Haskell lets you write immensely expressive code. What gets abstracted away all through all that expressiveness is the doubly nested loops and linear time linked list operation. Lets not even start on the overhead that is added when you factor laziness into the picture. Yes, the purity of your functions makes it easy to quickly measure the time complexity of it by increasing the input size but this is going to require discipline.

## Is Haskell still worth learning?

Yes. Haskell is the laboratory of all great ideas in language design and is likely going to be that way for a while to come. I am wiser for seeing what polymorphism looks like when done right. Everything about the language has me in its thrall. 

It's like learning Latin. You probably won't get the opportunity to use it on an everyday basis. However, it will enrich your understanding of just about every other language you know.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTM2MDM5NjA5Ml19
-->