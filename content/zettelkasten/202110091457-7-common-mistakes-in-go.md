---
title: "7 Common Mistakes in Go"
date: "2021-10-09"
lastmod: "2021-10-09"
author: "joergmis"
type: "zettel"
tldr: ""
tags:
- "@softwareengineering"
- "@go"
- "@talk"
- "@stevefrancia"
- "@mistakes"
toc: yes
---

## Intro

> Do you know the difference between a master and a beginner?
> The master has failed more times than the beginner has tried.

> We need to think about failure differently. [...] Mistakes aren't a necessary evil [...]
> They are an inevitable consequence of doing something new and as such should be seen as valuable.
> -- Ed Catmull

Go is a relativly new language and therefore, new things are done with the language.

## Mistakes

### Not accepting interfaces

In go, types can express behaviour and state.
Interfaces on the other hand can only express behaviour but permit extensibility (anything that satisfies the interface can be used -> *adherence satisfied by only the behaviour*).

Not accepting interfaces is overly prescriptive and not normally not necessary if the interfaces are well-thought out.

### Not using `io.Reader` and `io.Writer`

- simple and flexible
- provide access to a huge funcionality
- keeps operation flexible

One typical example would be tests - if you don't use those interfaces, you probably are relying on the filesystem for tests.
When using such interfaces, you can simply "mock" the file system by using a buffer.

### Requiring broad interfaces

Functions should only accept the functionality they need.
This helps the reader to understand from only the signature what the function/method expects from the input.

If functionality from multiple interfaces is needed, they can still be composed into a new one:

```
type File interface {
  io.Closer
  io.Reader
  // and so on
}
```

*See also [SOLID Design Principles | Interface Segregation Principle](/zettelkasten/202110032135-solid-design#interface-segregation-principle)*

### Methods vs functions

Many people come from an OO (object oriented) background and therefore naturally feel drawn to define many things in structs and methods.

> Functions should not depend on state.
> With the same input, a function will always result in the same output.

> A method defines behaviour of a type.
> A methods should use state.

```
// function -> can accept interfaces as input
func calculateSteps(data io.Reader) int { ... }

// method -> bound to a specific type
func (s *Server) Render() string { ... }
```

Methods should be used when you change the state of a type.
Methods might share the same behaviour (such as same input -> always same output) but the difference is that they typically change some state of the type.

### Pointers vs values

The general question should not be about performance but if you want to share the value.
If you don't want to share it, use a value (-> copy), otherwise use a pointer.

The same applies to methods; if you want to share a value use a pointer receiver.
But note that this is per default not safe for concurrent access.
That is something that you will have to handle.

The code below is from the time package and a good example why you sometimes want to use value receivers.
The state of the struct is ever-changing and you want it from a specific point.
But at that point, you don't care anymore if the state has changed and therefore don't need a pointer receiver - a copy of the value is enough.

```
type Time struct {
  sec int64
  nsec uintptr
  loc *Location
}

func (t Time) IsZero() bool {
  return t.sec == 0 && t.nsec == 0
}
```

### Thinking of errors as strings

- `errors.New("some error")` is often sufficient
- string comparison is not a good approach - *it is better to export the errors so that you are able to compare values*
- custom errors
  - can help to provide consistent feedback
  - can provide a type with additional methods
  - can provide dynamic values based on the internal state

An example from docker is written below.
The nice thing about the custom error type is that you can check for other stuff like the error code which in this case allows for localization.

```
type Error struct {
  Code ErrorCode
  Message string
  // ...
}

func (e Error) Error() string {
  // this method implements the error interface
}
```

With exported, simple errors you can check against the value.
With more complex error types, you can still check the type of the error and depending on the result continue or not.

```
n, err := f.WriteAt(x, 3)
if _, ok := err.(*PathError); ok {
  // maybe continue despite the error
}
```

### To be safe or not to be

> You can't make everyone happy - you aren't a jar of nutella

- if you create a library, someone will use it concurrently
- data structures (generally) are not safe for concurrent access
- values are not safe so you need to create safe behaviour around them

Possible solutions include mutexes or channels.
However, safety comes at a cost:

- imposes behaviour on the consumer
- *proper APIs allow the consumer to add safety as needed -> see maps in go, which are unsafe intentionally and by design*
- consumers then can use channels / mutexes

### Not making mistakes

> Failure is a manifestation of learning and exploration.
> If you aren't experiencing failure then you are making a worse mistakes.
> You are being driven by the desire to avoid it.
> -- Ed Catmull

## Sources

- [Youtube - 7 Mistakes in Go - Steve Francia](https://www.youtube.com/watch?v=29LLRKIL_TI)

## Backlinks

- [SOLID Design Principles | LSP](/zettelkasten/202110032135-solid-design#liskov-substitution-principle-lsp)
- [SOLID Design Principles | Interface Segregation Principle](/zettelkasten/202110032135-solid-design#interface-segregation-principle)