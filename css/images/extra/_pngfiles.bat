@echo off

SET tempset_OUTPATH=png\
rem (.+)\.svg
rem CALL _svg2png.bat \1.svg %tempset_OUTPATH%\1.png 14
CALL _svg2png.bat book-black.svg %tempset_OUTPATH%book-black.png 14
CALL _svg2png.bat book-white.svg %tempset_OUTPATH%book-white.png 14
CALL _svg2png.bat scanner-black.svg %tempset_OUTPATH%scanner-black.png 14
CALL _svg2png.bat scanner-white.svg %tempset_OUTPATH%scanner-white.png 14
CALL _svg2png.bat stack-black.svg %tempset_OUTPATH%stack-black.png 14
CALL _svg2png.bat stack-white.svg %tempset_OUTPATH%stack-white.png 14

CALL _svg2png.bat facebook-black.svg %tempset_OUTPATH%facebook-black.png 14
CALL _svg2png.bat google-plus-black.svg %tempset_OUTPATH%google-plus-black.png 14
CALL _svg2png.bat twitter-black.svg %tempset_OUTPATH%twitter-black.png 14
CALL _svg2png.bat facebook-white.svg %tempset_OUTPATH%facebook-white.png 14
CALL _svg2png.bat google-plus-white.svg %tempset_OUTPATH%google-plus-white.png 14
CALL _svg2png.bat twitter-white.svg %tempset_OUTPATH%twitter-white.png 14

echo Koniec.
pause
