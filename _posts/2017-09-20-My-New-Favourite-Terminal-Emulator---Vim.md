I hate having to use the mouse. I do everything I can to change my workflow so that I never have to touch it. That includes using a [tiling window manager](/Tiling-Window-Managers), using Firefox with VimFx extenstion so that I can use my browser just the way I use vim and using commandline apps rather than GUI apps for pretty much anything (vim, alpine, musikcube etc.)

However, the one thing that really forced me to use the mouse quite often was my terminal emulator. Most terminal emulators are fine as long as you running commands. If you want to scroll up to see text though, you'll need some uncomfortable keystroke (Win + Shift + up/down in gnome-terminal). Worse is if you want to select text from a terminal, to copy paste somewhere else. As of this writing the only sane way to do this WITHOUT using the mouse is to always run your session via `screen`. `screen` is a great piece of software, but I really don't want to muscle memorize a whole slew of different shortcuts to change modes and select text when as a vim user, I have a wonderful workflow ingrained in me already. The [hoops you need to jump through in gnome-terminal to do this natively are ridiculous](https://askubuntu.com/questions/302263/selecting-text-in-the-terminal-without-using-the-mouse).

So, that began my next quest: are there ANY termimal emulators out there that let me use vim shortcuts. Went through a bunch of terminal emulators trying to get vim shortcuts to work. I hit dead ends repeatedly. I also tried using zsh's Vi mode. Am probably definitely going to use zsh as my shell, but it's vi mode does not let me customize the shortcuts the way I like. 

For eg. I use Cntrl+l and Cntrl+h to jump back and forth from start and ends of lines because I don't like the vim defaults. Another indispensable cusotmization is using a quick double press of 'j' key to get out of INSERT mode. I just can't live without them. 

As it turns out, the perfect solution was always at hand.

[Neovim](https://neovim.io/) is a really great vim fork I have been using for a while now. neovim [can make open a terminal emulator buffer](https://neovim.io/doc/user/nvim_terminal_emulator.html). I had even been happily using this feature for the last 2 months all the while looking for a terminal emulator that I could copy this workflow with. 

I feel like kicking myself for not seeing the obvious: why don't I just use nvim as my primary terminal emulator?

There were a few simple customizations I needed to do:

- allow nvim to start in insert mode at startup (done with the +startinsert commandline option)
- make nvim start with a different stripped down configuration file because you don't want to incur the slowdown at startup of loading heavy plugins. (done with the -u option)
- hide the vim status line at the bottom, just for cosmetic purposes so that the result looked like a terminal rather than another vim instance. (Achieved this thanks to this [Stackoverflow snippet](https://unix.stackexchange.com/questions/140898/vim-hide-status-line-in-the-bottom))

So all in all, I just had to make this my terminal emulator:

```bash
nvim +startinsert -u $HOME/.i3/terminal.init.vim term://bash
```

where my `terminal.init.vim` file looks like:

```vim
set guifont=Monospace\ 12

set t_Co=256
set background=dark
highlight Normal ctermbg=NONE
highlight nonText ctermbg=NONE

" Make vim use X clipboard by default while doing yanks and pastes
set clipboard=unnamedplus

" Prevent vim from clearing out the clipboard on exit
autocmd VimLeave * call system("xsel -ib", getreg('+'))

" Prevent vim from forcing you to save a changed buffer or using ! when
" switching between buffers
set hidden

" Specify a directory for plugins (for Neovim: ~/.local/share/nvim/plugged)
call plug#begin('~/.vim/plugged')

" Make sure you use single quotes
Plug 'junegunn/vim-easy-align'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'flazz/vim-colorschemes'
Plug 'xolox/vim-misc'
Plug 'qpkorr/vim-bufkill'

" Add plugins to &runtimepath
call plug#end()

colorscheme molokai

set relativenumber
set number

nnoremap <C-S-tab> :bprevious<CR>
nnoremap <C-tab>   :bnext<CR>

filetype plugin indent on
syntax enable

" Neovim's Python provider
"let g:python_host_prog  = '/usr/local/bin/python3'
"let g:python3_host_prog = '/usr/local/bin/python3'

" Move up and down in autocomplete with <c-j> and <c-k>
inoremap <expr> <c-j> ("\<C-n>")
inoremap <expr> <c-k> ("\<C-p>")

" Map jj to leave insert mode 
inoremap jj <esc>

" Easier jumping to first non-space and 
" last non-space letters in line
inoremap <C-h> <C-o>^
inoremap <C-l> <C-o>g_
vmap <C-h> <Home>
vmap <C-l> <End>

" Easier jumping to home and end
nnoremap <C-h> <Home>
nnoremap <C-l> <End>

" Disable Arrow keys in Escape mode
map <up> <nop>
map <down> <nop>
map <left> <nop>
map <right> <nop>

" Disable Arrow keys in Insert mode
imap <up> <nop>
imap <down> <nop>
imap <left> <nop>

set directory=$HOME/.vim/swapfiles//
set backupdir=$HOME/.vim/backups//
imap <right> <nop>

" Remap terminal mode toggle
tnoremap jj <C-\><C-n>

" Set splitting modes
set splitbelow
set splitright

" Keep mouse disabled
set mouse=c

" Remap bufkill from BD to cntrl-x
map <C-x> :BD<cr>

" Code to hide the status line just for cosmetic purposes
let s:hidden_all = 0
function! ToggleHiddenAll()
    if s:hidden_all  == 0
        let s:hidden_all = 1
        set noshowmode
        set noruler
        set laststatus=0
        set noshowcmd
    else
        let s:hidden_all = 0
        set showmode
        set ruler
        set laststatus=2
        set showcmd
    endif
endfunction

call ToggleHiddenAll()
```

So what do the end result look like?

![nvim as terminal emulator](/images/posts/nvim_as_terminal_emulator.png)
 
