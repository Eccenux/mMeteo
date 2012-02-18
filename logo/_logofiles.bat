@echo off

echo Android
CALL _svg2png.bat Logo.svg logo036.png 36
CALL _svg2png.bat Logo.svg logo048.png 48
echo iPhone
CALL _svg2png.bat Logo.svg logo057.png 57
echo iPhone + Android
CALL _svg2png.bat Logo.svg logo072.png 72
echo Nokia
CALL _svg2png.bat Logo.svg logo080.png 80
echo Nokia + iPad
CALL _svg2png.bat Logo.svg logo114.png 114
echo Default
CALL _svg2png.bat Logo.svg logo128.png 128

echo Koniec.
pause
