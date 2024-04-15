# FFT_SVG_tracer

Inspired by one of the video from 3Blue1Brown via [youtube](https://youtu.be/r6sGWTCMz2k?t=1230), I created SVG tracer in which it reads a SVG file, calculates the fourier transform of the path presented in the SVG file and traces the path reading from the SVG file.

## Demo:


![Alt Text](https://github.com/visittor/FFT_SVG_tracer/blob/main/demo/demo_github.gif)
![Alt Text](https://github.com/visittor/FFT_SVG_tracer/blob/main/demo/demo_github_zoom.gif)

## How it works

Every (continueous) function $f(t)$ can be represented with sumation of the sinodial function in form of $f(t) = \int_{-\infty}^{\infty} a(x)e^{-2\pi itx} dx$.
Intuitively, it is like connecting an infinite number of joints with each joint rotates at the frequency of $x$ and has length of $a(x)$ together. If we choose
the appropiate value of $a(x)$, the end point of this connecting joints will trace the path of $f(t)$.

In the code in this repository, we do exactly that. We, first, read the SVG file which contains path ( $f(t)$ ). We sample $2^{n}$ points from this path. Then,
find the value of $a(x)$ using the algorithm called Fast Fourier Transform (FFT). Each rotating joints in the demo represents each term of the fourier series.
They rotate at different speed which depends the value of $x$. You can see that the first and second joint are rotate once every cycle (but in different direction),
while third and fourth joint rotate twice every cycle and so on. The length of each joint represents the value of $a(x)$ which we get from FFT. When we connect
these joints together, we can trace the SVG path using the end point.
