# Linear Transformations in R^3

## Setup

To run the project with the files from the GitHub, download the source code (go to https://github.com/ronikbhaskar/linear_algebra_project and click the green "Code" button), and open `index.html` with a browser (you can probably just double-click). Chrome is recommended.

 - Be sure you are connected to WiFi to run this project, as it uses CDN dependencies to make the project size smaller without using npm.

Alternatively, go to this link: (https://compassionate-bartik-4de599.netlify.app/) to run the visualizer.

## Features

 - In all of the text entry fields, you can use more than just digits. You can use standard arithmetic operations (2 + 3 - 4 * 5 / 6 ^ 7), parentheses ((3.48 + 0.992) * -5), trig functions and pi (sin(2pi/3)), and a few others like e, sqrt, log (which is base e). Furthermore, you can use "t" as an unknown in your expressions, and adjust the value using the slider on the right. 

 - With the checkboxes, you can easily choose whether or not to view any of the 3 matrices, the custom vector, the basis vectors, a grid of vectors as points, the coordinate grid, the coordinate axes / the "0" lines. If you enable a matrix or vector but it is incomplete / has bad syntax, it will be ignored until you have finished your changes.

 - The current working expression for the linear transformation can be seen below the "t" slider, along with an approximate calculation of the matrix composition. Do note that the one being applied visually is more precise.

 - Below each matrix are buttons to either make the above matrix the inverse of another, or to replace itself with its square.

 - Clicking the "Change Grid Scale" button will cycle between viewing a coordinate grid of 5 in each direction to 10 -> 20 -> 40 -> 5.

 - On the far right, each matrix has a corresponding dropdown with options to generate a random matrix with a certain property. Note that the rotation matrices make use of the "t" slider, so you can start playing around with the angle very quickly.

 - The basis vectors are red, green, and blue and correspond to x = (1,0,0), y = (0,1,0), and z = (0,0,1) respectively.

 - To see the coordinates of any vector, simply hover your mouse over it.
   - Note: There is a bug where if you are in Turntable Rotation mode, you cannot hover over vectors of the form (0,0,a).

 - To go back to the original view, click the house icon on the viewing window. That menu also allows you to choose different rotation types and even save the graph as a .png file.

