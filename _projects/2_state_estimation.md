---
layout: page
title: State and Parameter Estimation on Manifolds
description: Unscented Kalman filtering for stochastic systems whose state lives on a Riemannian manifold.
img: assets/img/projects/state_estimation.png
importance: 2
category: research
github: https://github.com/Roshan818/State-and-Parameter-Estimation
---

Work from my undergraduate thesis at IIT Guwahati on state and parameter estimation for
stochastic state-space systems evolving on Riemannian manifolds.

The standard Kalman machinery assumes state lives in a vector space. Plenty of real
systems don't — orientation lives on SO(3), pose on SE(3), and naively applying a linear
filter to those coordinates gives you estimates that drift off the manifold entirely.
The unscented Kalman filter on manifolds (UKF-M) handles this by propagating sigma points
through retraction and local-chart operations instead of vector addition.

The filter itself is the UKF-M library by Brossard, Barrau and Bonnabel; my thesis work
builds on it.

{% comment %}<<IMPORTANT — read before publishing this page.

The README currently in this repo is the upstream UKF-M library's own README. Anyone
who checks will see that in about ten seconds, so the page has to be explicit about
what is yours and what is the library's.

Rewrite the paragraph below to say exactly that:
  - which parts are the UKF-M library by Brossard, Barrau and Bonnabel
  - what YOU implemented, modified, or ran on top of it
  - what system you applied it to and what you were estimating

If the honest answer is "I used the library as-is to run experiments for my thesis",
write that. It is still a legitimate project — applying an estimation library correctly
to a real problem is real work. What sinks you is letting a reader assume you wrote the
filter. Also fix the repo's README while you're at it.>>{% endcomment %}

**What I applied it to.** My thesis, supervised by
[Prof. Budhaditya Hazra](https://www.iitg.ac.in/budhaditya.hazra/homepage/index.html), looked at
parameter and state estimation of vibrating structures equipped with geometrically consistent
tuned mass dampers (GTMDs). We simulated the physical system in MATLAB and Python and used
Kalman filters on Riemannian manifolds, framed through Lie algebra, as the estimation tool.

Before the thesis I spent a summer research internship with the same group (May–Jul 2023)
exploring Riemannian geometry and Itô calculus: using geodesics and tensors to capture
nonlinear relationships, and estimating the parameters of Gaussian and log-normal densities
on curved spaces with MLE and Bayesian models.

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/state_estimation.png" title="Chaotic pendulum on SO(3)" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">Trajectory of a chaotic pendulum on the SO(3) manifold.</div>

**Documents:** [BTP report, phase 1](/assets/pdf/btp_phase1_report.pdf) ·
[Term paper](/assets/pdf/estimation_term_paper.pdf) ·
[Slides](/assets/pdf/estimation_presentation.pdf)

**Why it still matters to me.** This is where my interest in estimation started, and it's
the thread running through what I'm reading now — how a controller behaves when the state
estimate it depends on is wrong is, to me, the more interesting half of learning for
control.