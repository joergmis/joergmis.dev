---
title: "First Class Functions"
date: "2021-10-03"
lastmod: "2021-10-03"
author: "joergmis"
type: "zettel"
tldr: ""
tags:
- "@go"
- "@davecheney"
- "@patterns"
- "@softwareengineering"
toc: yes
---

A powerful concept of (not only) go are first class functions - also known as anonymous
functions or closures. It lets you pass around behaviour instead of data that
is interpreted. Many of the code examples below are from one of the talks
mentioned in the [sources](#sources).

## The functional option pattern vs interfaces

```
type Config struct{}

func WithHills(c *Config) { ... }

type Terrain struct {
  config Config
}

func NewTerrain(options ...func(*Config)) *Terrain {
  var t Terrain
  for _, option := range options {
    option(&t.config)
  }
  return &t
}

func main() {
    t := NewTerrain(WithHills)
}
```

The pattern gets a bit confusing if you add arguments to the function. At least
for people who don't often write for example javascript. To match the function
`NewTerrain( ... )` you have to create a function that returns a function.

```
func WithCities(n int) func(*Config) { ... }

func main() {
  t := NewTerrain(WithCities(10))
}
```

As you can see in the code snippet above, the function `WithCities` is 
evaluated and its return value is passed as a value to `NewTerrain( ... )`.

Something similar can be achieved with an interface.

```
type Option interface {
  Apply(*Config)
}

func NewTerrain(options ...Option) *Terrain {
  var config Config
  for _, option := range options {
    option.Apply(&config)
  }
}

type splines struct {}

func (s *splines) Apply(c *Config) { ... }

func WithReticulatedSplines() Option {
  return new(splines)
}

type cities struct {}

func (c *cities) Apply(c *Config) {}

func WithCities(n int) Option {
  return &cities{
    cities: n,
  }
}

func main() {
  t := NewTerrain(
    WithReticulatedSplines(), 
    WithCities(9),
  )
}
```

Using an interface in this case results in much more code you need to write. A
hint that instead of an interface you maybe should use the functional option
pattern is when the interface contains only one method.

## Properties of first class functions

There is a difference between passing data around vs. passing functions around.
Functions allow to pass behaviour instead of data to be interpreted. 

### Calculator V1

```
type Calculator struct {
  acc float64
}

const (
  OP_ADD = 1 << iota
  OP_SUB
  OP_MUL
)

func (c *Calculator) Do(op int, v float64) float64 {
  switch op {
    case OP_ADD:
      c.acc += v
    // ...
  }
  return c.acc
}

func main() {
  var c Calculator
  fmt.Println(c.Do(OP_ADD, 200))
}
```

This does not look to bad. However, when it comes to extending the 
calculator, you would have to add code in multiple locations. With every new
addition, the

> Because each time we add an operation, we also have to encode into `Do()` the
> knowledge of how to interpret the operation.
> -- Dave Cheney

### Calculator V2

```
type Calculator struct {}

type opfunc func(float64, float64) float64

func (c *Calculator) Do(op opfunc, v float64) float64 {
  c.acc = op(c.acc, v)
}

func Add(a, b float64) float64 {
  return a + b
}

func main() {
  var c Calculator
  fmt.Println(c.Do(Add, 5))
}
```

This allows us to write operations as functions and the caluclator is much more
extensible.

But there are still problems - for example, when you want to calculate the 
square root which only needs one parameter.

### Calculator V3

```
func Add(n float64) func(float64) float64 {
  return func(acc float64) float64 {
    return acc + n
  }
}

func Sqrt() func(float64) float64 {
  return func(n float64) float64 {
    return math.Sqrt(n)
  }
}

func (c *Calculator) Do(op func(float64) float64) float64 {
  c.acc = op(c.acc)
  return c.acc
}

func main() {
  var c Calculator
  c.Do(Add(10))
  c.Do(Sqrt())
  c.Do(math.Cos)
}
```

What happened here:

- start with a model with hardcoded logic -> functional model where we pass in 
  the behaviour we want
- evolving a step further -> generalize calculator a bit further for operations
  regardless of how many arguments they take

## Actors

### Chatserver V1

```
type Mux struct {
  mu sync.Mutex
  conns map[net.Addr]net.Conn
}

func (m *Mux) Add(conn net.Conn) {
  m.mu.Lock()
  defer m.mu.Unlock()
  m.conns[conn.RemoteAddr()] = conn
}

func (m *Mux) Remove(addr net.Addr) {
  m.mu.Lock()
  defer m.mu.Unlock()
  delete(m.conns, addr)
}

func (m *Mux) SendMsg(msg string) error {
  m.mu.Lock()
  defer m.mu.Unlock()
  for _, conn := range m.conns {
    err := io.WriteString(conn, msg)
    if err != nil {
      return err
    }
  }
}
```

> Don't communicate by sharing memory, share memory by communicating
> -- Rob Pike

### Chatserver V2

```
type Mux struct {
  add     chan net.Conn
  remove  chan net.Addr
  sendMsg chan string
}

func (m *Mux) Add(conn net.Conn) {
  m.add <- conn
}

func (m *Mux) Remove(addr net.Addr) {
  m.remove <- add
}

func (m *Mux) SendMsg(msg string) error {
  m.sendMsg <- msg
  return nil
}

func (m *Mux) loop() {
  conns := make(map[net.Addr]net.Conn)

  // no need for the mutex anymore because the shared context now is local to
  // the loop function -> can't be mutated outside of this context
  for {
    select {
    case conn := <-m.add:
      conns[conn.RemoteAddr()] = conn
    case addr := <-m.remove:
      delete(m.conns, addr)
    case msg := <-m.sendMsg:
      for _, conn := range conns {
        io.WriteString(conn, msg)
      }
    }
  }
}
```

Similar to the calculator, there is still a lot of hardcoded knowledge of how
to interpret the data which would need to be extended if you want to add new
functionality.

### Chatserver V3

```
type Mux struct {
  ops chan func(map[net.Addr]net.Conn)
}

func (m *Mux) Add(conn net.Conn) {
  m.ops <- func(m map[net.Addr]net.Conn) {
    m[conn.RemoteAddr()] = conn
  }
}

func (m *Mux) Remove(addr net.Addr) {
  m.ops <- func(m map[net.Addr]net.Conn) {
    delete(m, addr)
  }
}

func (m *Mux) SendMsg(msg string) error {
  m.ops <- func(m map[net.Addr]net.Conn) {
    for _, conn := range m {
      io.WriteString(conn, msg)
    }
  }
  return nil
}

func (m *Mux) loop() {
  conns := make(map[net.Addr]net.Conn)
  for _, op := range m.ops {
    op(conns)
  }
}
```

Now we have moved the logic from the `function` into anonymous functions which
are created by helpers.

Still a few problems -> error handling.

### Chatserver V4

```
type Mux struct {
  ops chan func(map[net.Addr]net.Conn)
}

func (m *Mux) SendMsg(msg string) error {
  result := make(chan error, 1)
  m.ops <- func(m map[net.Addr]net.Conn) {
    for _, conn := range m.conns {
      err := io.WriteString(conn, msg)
      if err != nil {
        result <- err
        return
      }
    }
    result <- nil
  }
  // note that this is blocking
  return <-result
}

func (m *Mux) loop() {
  conns := make(map[net.Addr]net.Conn)
  for _, op := range m.ops {
    op(conns)
  }
}

// now it's easy to add new functionality
func (m *Mux) PrivateMsg(addr net.Addr, msg string) error {
  result := make(chan net.Conn, 1)
  m.ops <- func(m map[net.Addr]net.Conn) {
    result <- m[addr]
  }

  conn := <-result
  if conn == nil {
    return errors.Errorf("client %v not registered", addr)
  }
  return io.WriteString(conn, msg)
}
```

## Sources

- [dotGo 2016 - Dave Cheney](https://www.youtube.com/watch?v=5buaPyJ0XeQ)
- [Golang UK Conf - Bryan Boreham](https://www.youtube.com/watch?v=yCbon_9yGVs)

## Backlinks

- [ Actor Model ]( /zettelkasten/202110031733-actor-model )
