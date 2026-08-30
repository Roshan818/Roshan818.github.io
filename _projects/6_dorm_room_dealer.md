---
layout: page
title: Dorm Room Dealer
description: A campus marketplace for buying and selling secondhand goods between students.
img: assets/img/projects/drd.png
importance: 6
category: software
github: https://github.com/Roshan818/Dorm-Room-Dealer
redirect: https://dorm-room-dealer.vercel.app
---

A Django marketplace for students to buy and sell secondhand items within their campus —
listings with images, accounts, and email-based notifications for enquiries.

Built because the alternative on most campuses is a WhatsApp group where everything
scrolls away in a day.

<<FILL: Did anyone use it? Number of listings, number of users, whether it ran for a
term. A small real number here — "used by ~40 students over one semester" — is worth
more than any feature list, because deployed-and-used is the rarest thing on a student
portfolio.>>

<<SECURITY — do this before linking anyone here.

Your README walks through putting a Gmail address and an app-generated password directly
into settings.py, and lists five other files where the same address gets hardcoded.
Before you point recruiters at this repo:

  1. Check the commit history for a real credential that got committed. GitHub's secret
     scanning won't catch a Gmail app password.
  2. If one is in there, revoke that app password in your Google account immediately.
     Deleting the line from the current file does NOT remove it from history.
  3. Move the credentials to environment variables and update the README.

This applies whether or not you link the project — the repo is already public.>>