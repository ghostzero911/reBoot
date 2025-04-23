# Calculator App v.1.0.5

This app is one of my old stuff and available in codepen.io.
Here is the link to the [early stage version 0.1.2](https://codepen.io/ghostzero911/pen/WbNKZYj)

In the original version, it is build with ReactJS (Idk if it was React 16 or 18, blame my old memory).
And here, I rework and reboot the project using React 19 + TypeScript + Vite with some enhancements and tweaks.

The content in this repo is uncompiled. In other words, it is a developement sources.
Feel free to adjust and work on it.

## What's new
- TypeScript is now used for better life quality.
- Negative sign is now available as single button instead of mixin with subtract sign.
- ```eval()``` is no longer used, replaced with new calculation method using Shunting-yard algorithmis. 
- Processing functions and methods are restructured as two functional classes: ```Calculator``` and ```InputProcessor```

## Bug fixes
- Fix the display that goes out bound when overflow from container.
- Fix the invalid expressions that show on display after using equal sign.
- Fix the bug where the expression 0.0000000000000~ has unlimited digit.
- Fix the bug where incomplete decimal ```0.``` will be replaced by operand on operator input.
- Fix crash that happened after spamming decimal button followed by number on a succesful calculation.
- Fix crash that happened when pressing ```=``` sign on incomplete expressions such as ```0.``` or ```7+```.
- Subtract operator can now be properly used on its own. 

## Potential Upgrades

Some potential upgrades that is planned on future updates:
- Exponential equations
- Arithmatic equations such as sin, cos, tan
- Delete/Backspace function
