---
title: "Building a note-taking system"
date: "2021-09-04"
lastmod: "2021-09-04"
author: "joergmis"
type: "blog"
draft: yes
series:
- note taking system
toc: yes
---

## Intro

During my education, particularly my computer science studies, I was playing
around with different note-taking approaches. In the final year, I felt 
comfortable taking notes by hand during the lectures and writing summaries in
markdown for the exams *(+ converting them to PDF with pandoc)*.

This worked well enough for the lectures where you were presented with a
structured flow of information from a limited number of inputs. In the *AI* 
lecture you did not have to reference ideas from *Algorithms & Datastructures* 
lectures. You could simply listen and take notes.

Today, this system would no longer work. Going forward, I want to capture ideas
and knowledge in a way that I can reference it later on. The goal is to have a
system which:

- allows you to capture knowledge and ideas
- allows you to connect different notes and ideas (by referencing them)
- allows you to discover connections (by indirect references)

Basically, I want to build a graph with the nodes being notes or ideas, the 
edges being references / hyperlinks.

The benefits should be clear; you can add knowledge at all time. You can expand
ideas, discover connections over other notes that you were not aware of. An 
idea can span multiple notes (but does not have to) and you are able to 
reference one part of the idea from another note.

## Requirements

In addition to the requirements mentioned above, there are a few technical
requirements:

- all content in plain text
- easily searchable notes
- no context-switching; navigating and creating notes from within the editor
- system that works also online
- content under version control

## Tooling

- [Vim](https://www.vim.org)
- [Hugo](https://gohugo.io)
