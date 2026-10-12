---
layout: page
title: Age and Gender from CCTV Footage
description: Inter-IIT Tech Meet 10.0 — bronze medal, Bosch problem statement.
img: assets/img/projects/bosch.png
importance: 7
category: research
github: https://github.com/Roshan818/Age_and_Gender_Detection_through_CCTV_Videos
---

Team entry for Bosch's problem statement at the 10th Inter-IIT Tech Meet (Jan – Mar 2022),
which won bronze: estimate the age and gender of people in low-quality surveillance video.

**What made it hard.** CCTV frames are small, blurry and badly lit, faces are often not
visible, and the system had to run fast enough to be usable in real time. We set three goals:
use all the information available (face and body, across every frame), keep the frame rate
practical, and produce output a person can read and check.

**The pipeline.**

- **Detection:** YOLOv5 to find people in each frame.
- **Tracking:** ByteTrack to follow each person across frames.
- **Upscaling:** SwinIR (with SRGAN as an alternative) to super-resolve face and body crops.
  This step can be skipped to raise the frame rate.
- **Prediction:** a Swin Transformer backbone predicting both attributes, with a CORAL layer
  for ordinal age prediction.
- **Inference tricks:** gender is the mode of the per-frame predictions for a tracked person,
  and age windows are sized dynamically from the CORAL layer's confidence.

{% include figure.liquid loading="eager" path="assets/img/projects/bosch.png" title="Pipeline" class="img-fluid rounded z-depth-1" %}

**Results.** We compared several models. A multi-head Swin with a CORAL layer, trained on
SwinIR-upscaled crops, performed best: 94.4% accuracy on gender and a mean absolute error of
5.25 years on age.

{% include figure.liquid loading="lazy" path="assets/img/projects/bosch_model_tab.png" title="Model comparison" class="img-fluid rounded z-depth-1" %}

**Documents:** [Slides](/assets/pdf/bosch_presentation.pdf) ·
[Code](https://github.com/Roshan818/Age_and_Gender_Detection_through_CCTV_Videos)
