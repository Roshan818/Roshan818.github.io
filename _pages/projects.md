---
layout: page
title: projects
permalink: /projects/
description: Things I've built — research code, tools, and a couple of products.
nav: true
nav_order: 1
display_categories: [research, software]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  {%- for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}"><h2 class="category">{{ category }}</h2></a>
  {%- assign categorized_projects = site.projects | where: "category", category -%}
  {%- assign sorted_projects = categorized_projects | sort: "importance" %}
  {% include projects_grid.liquid projects=sorted_projects %}
  {% endfor %}
{%- else -%}
  {%- assign sorted_projects = site.projects | sort: "importance" -%}
  {% include projects_grid.liquid projects=sorted_projects %}
{%- endif -%}
</div>