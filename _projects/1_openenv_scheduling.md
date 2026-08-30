---
layout: page
title: Smart Factory Scheduling
description: An OpenEnv-compliant RL environment for job scheduling under machine failures and deadlines.
img: assets/img/projects/openenv.png
importance: 1
category: research
github: https://github.com/Roshan818/OpenEnvRLScheduling
---

A reinforcement learning environment that models the scheduling problem as it actually
appears on a factory floor: jobs arrive with deadlines and priorities, machines break
down stochastically, and the agent has to keep throughput up without missing due dates.

It implements the [OpenEnv](https://github.com/openenv/openenv) interface, so it drops
into any training loop that already speaks that protocol.

**Observation space.** Machines carry an id, a status (idle, busy, broken), the job they
are currently running, and a failure rate. Pending jobs carry remaining time, deadline,
priority on a 1–3 scale, and their assigned machine. The agent also sees completed jobs,
the current timestep, and the episode horizon.

**Why this problem.** Job-shop scheduling is a clean testbed for decision-making under
stochastic disruption. The interesting behaviour isn't optimal assignment on a static
job list — it's what a policy does when a machine dies mid-job and the schedule it was
committed to no longer exists.

<<FILL: Results. What did you train against it, and what happened? Even "PPO beats the
greedy earliest-deadline-first baseline on throughput but loses on deadline misses" is
a real finding. If you haven't trained anything on it yet, say that plainly — an honest
"environment built, baselines next" is fine and better than silence.>>

The repository is packaged as a Docker-based Hugging Face Space.

<<TODO: deploy the Space and link it here. The front matter in your README already has
`sdk: docker` set up for it. A clickable demo is worth more than this entire write-up.>>