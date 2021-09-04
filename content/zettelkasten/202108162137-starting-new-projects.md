---
title: "Starting new projects"
date: 2021-08-16
lastmod: 2021-08-16
author: "joergmis"
type: "zettel"
tldr: ""
tags:
- "@projectmanagement"
- "@requirements"
- "@mvp"
- "@designdoc"
- "@stakeholder"
toc: yes
---

I came across [a tweet from Peter Bourgon](https://twitter.com/peterbourgon/status/1359568494837329920?s=20)
where he talkes about what you should think about when starting a new project:

- what problem are we solving?
- who are the stakeholders?
- what are the goals and especially [non-goals](/zettelkasten/202109042229-non-goals)?
- what's the minimum viable feature set?
- how do we measure success?

*Just a reminder - make sure you get a hold of all stakeholders when trying to
define the problem you want to solve. If someone is missing, make at least sure
that the person gives feedback after you have an idea of the problem (space).
The same goes for the minimum viable feature set - get a consensus.*

Later on, he mentiones why you probably should not talk (yet) about what 
database you want / should use. After all:

> [...] is an implementation detail, which follows from the design, which 
> follows from an understanding of the problem.
-- Peter Bourgon

Visualised:

> problem -> design -> implementation

After the problem has been defined (and everybody has agreed on it), you can
talk about the technologies you want to use. You now have the context to create
a [designdoc](/zettelkasten/202108161755-design-doc) where you can explain why
the features of technology X satisfies the need of the project.

As a software engineer, I get excited about new technologies. This way of
starting new projects and the requirement to explain *why* the technology is a 
good fit serves as a reminder to take a step back and focus on solving the 
problem of the customer.

## Sources

- [Tweet from Peter Bourgon](https://twitter.com/peterbourgon/status/1359568494837329920?s=20)
