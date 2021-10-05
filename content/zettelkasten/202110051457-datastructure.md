---
title: "Datastructures"
date: "2021-10-05"
lastmod: "2021-10-05"
author: "joergmis"
type: "zettel"
tldr: ""
tags:
- "@softwareengineering"
- "@datastructures"
- "@theory"
- "@codinginterview"
- "@go"
toc: yes
---

## Intro

Datastructures are basically just different ways of organizing data. Depending 
on the current context, different structures are more convenient or performant.

Wikipedia does write it a bit more elaborate:

> a data structure is a data organization, management, and storage format that
> enables efficient access and modification.

### Complexity analysis

There are two measures with which you can compare algorithms:

- time complexity: how fast the algorithm is
- space complexity: how much memory or disk the algorithm uses

Note that *better* often depends on the context. When time does not matter you
might not care about time complexity but instead prefer an algorithm that is
easier to understand.

Nowadays, there is a trend towards simplicity since compute resources are 
becoming ever cheaper. *What struck me is that cloud providers such as AWS use
commodity hardware - because it is so cheap, it doesn't matter if it is not as
reliable as more expensive / reliable / durable hardware.*

### Big O Notation

*Read: `O(n)` -> the complexity of the algorithm is in O of n.*

Most often, the big o notation refers to the worst case scenario of an 
algorithm. It allows to describe how an algorithm behaves depending on the size
of the input. This might be, as mentioned above, regarding time or space usage.

The benefit of this notation is that it abstracts away differences when running 
algorithms on slow vs. fast computers. It provides a universal tool to compare
them.

Examples:

- `f(n) = a[0] + a[2]` -> constant -> `O(1)` 
- `f(n) = sum(a)` -> linear -> `O(n)` 
- `f(n) = sum(sum(a) + sum(a) + sum(a))` -> all linear -> linear + linear = 
  linear-> `O(n)` 
- `f(n) = pair(a) + sum(a)` -> quadratic + linear -> quadratic -> `O(n²)`
- `f(n) = pair(a) + sum(b)` -> quadratic + linear **but not the same input** ->
  `O(n² + m)`

A note regarding the last function: since the notation aims to estimate the
behaviour when n is going towards infinity, the difference of for example 
`O(n)` and `O(n²)` gets bigger and with time `O(n²)` will dominate. Therefore, 
the notation simplifies this to the dominating factor.

From good to worse to bad:

- `O(n)`
- `O(log(n))`
- `O(n)`
- `O(n*log(n))`
- `O(n²)`, `O(n³)`, ...
- `O(2^n)`
- `O(n!)`

![Complexity analysis](/images/code/complexity.png)
*Source: [freeCodeCamp](https://www.freecodecamp.org/news/my-first-foray-into-technology-c5b6e83fe8f1/)*

### Logarithm

Short explanation: `log_b(x) = y` means `b^y = x`. In computer science, you
basically always use `log_2`. When talking about `O(log(n))`, this means that
when the input size doubles, the "cost" only increases by one unit.

A typical example is a tree when you traverse it - with one double the size aka
one level more you only have to do one step more to get to the bottom.

## Datastructures

### Array (or slice)

`var a [5]int` or `var b []int`

- `O(1)`
  - access / update a value
  - remove a value at the end
- `O(n)`
  - insert a value at the beginning -> move all one back
  - insert / delete one value in the middle -> worst case, move `n - 1` items 
    -> `n`
  - *insert a value at the end; depending on the implementation (dynamic / 
    static)array either `O(n)` or `O(1)`*
  - copy the array

### Linked list

```
type list struct{
  head *element
  len int
}

type element struct {
  value interface{}
  next *element
}
```

- `O(1)`
  - access head
  - insert / remove head
- `O(n)`
  - access tail or element in the middle
  - insert / remove tail or element in the middle (worst case: element `n - 1`
    -> `n`)
  - search for a value

### Double-linked list

```
type list struct{
  head, tail *element
  len int
}

type element struct {
  value interface{}
  prev, next *element
}
```

- `O(1)`
  - access head or tail
  - remove / insert head or tail
- `O(n)`
  - access element in the middle
  - remove element in the middle (worst case: element `n - 1` -> `n`)
  - search for a value

*There is also a special variant: circular (double) linked list but there is 
not much difference.*

### Hash table

`var a map[string]int`

**On average**, all operations (insert / lookup / delete) run in constant time 
`O(1)` (worst case `O(n)`). How often you actually get the average depends on 
the implementation; partially it depends on the hash function.

The hash function basically maps the input (for example strings) to some
integer so that it can use an array under the hood. A basic example to get an 
index would be:

`f(input string) = ascii representation % len(ascii table)`

Problem arise when the hash function tends to match multiple (different) inputs
to the same index. For this, the hash table uses the index to not point to the
target value but to a linked list.

But there is more - the linked list needs to store more information in case 
there are multiple inputs landing on the same index -> the linked list entry
needs to point back to the original key. In the worst case, every input is 
mapped to the same bucket and that's why it could be `O(n)`.

### Stack

```
type stack []string

func (s *stack) Pop() string {
tmp := *s
       n := len(tmp) - 1
       element := tmp[n]
       tmp = tmp[:n]
       s = &tmp
       return element
}

func (s *stack) Push(e string) {
  *s = append(*s, e)
}
```

Stacks operate with the FIFO principle: first in, first out.

- `O(1)`
  - push / pop an element
  - peek at the top element
- `O(n)`
  - search for an element -> pop until found

Typically implemented as a dynamic array or single-linked list.

### Queue

```
type queue []string

func (q *queue) Enqueue(s string) {
  *q = append(*q, s)
}

func (q *queue) Dequeue() string {
  tmp := *q
  element := tmp[0]
  tmp = tmp[1:]
  q = &tmp
  return element
}
```

Queues operate with the LIFO principle: last in, first out.

- `O(1)`
  - enqueue / dequeue an element
  - peek at the front of the queue
- `O(n)`
  - search for an element -> dequeue until found

A queue is typically implemented as a double-linked list.

### Strings

Depending on the language, strings are immutable (in go they are)! This means 
that every mutation of the string would lead to many operations. The typicall 
example is:

```
example := "hello world"
var s newstring

// O(n²)
for _, c := range example {
  s += c
}

```

### Graph

*Naming: nodes are vertices, connections are edges.*

- acylic graph: has no cycles
- cyclic graph: has at least one cycle
- directed graph: the edges have directions
- undirected graph: the edges have no directions
- connected graph: if for every pair of vertices there is at least one edge
  that connects them
  - strongly connected: if the vertices have bidirectional edges
  - weakly connected: if there are (not necessarily bidirectional) edges 
    between the vertices

Graphs can be stored as adjacency lists. Meaning, that there is a table or 
array with lists with an entry for every node. Each entry is a list of 
adjacent nodes to which the vertice has a connection.

### Tree

- there is a root
- basically a directed, acyclic graph
- every node has childs
- a child has only one parent
- the whole tree is connected

There are a lot of different form of trees:

- binary tree: each node has at most two child nodes
  - binary search tree (BST)
- k-ary tree: each node has at most k children
- perfect binary tree: all leaf nodes have the same depth, all nodes have two
  children
- full binary tree: all nodes have either no or two child nodes

Space complexity: `O(n)`. Time complexity (through all nodes): `O(n)`. On a 
binary tree, going to a leaf, the time complexity is `O(log(n))`.

## Sources

- [Wikipedia - Data Structure](https://en.wikipedia.org/wiki/Data_structure)
- [Mutable strings in Golang](https://medium.com/kokster/mutable-strings-in-golang-298d422d01bc)
- *The Go Programming Language* by *Alan A. A. Donovan* and *Brian W. Kernighan*
