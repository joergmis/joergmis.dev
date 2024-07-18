+++
title = 'C++ Course Notes'
date = 2024-07-18T17:03:30+02:00
tags = [ 'c++', 'course' ]
+++

Unordered notes from a [c++ course](https://www.it-schulungen.com/seminare/softwareentwicklung/c-programmierung/modernes-c-fur-fortgeschrittene.html); mainly to provide one page to quickly search for snippets.

## r and l values

```cpp
std::string a = "hello";
std::string b = "world";

// sayHello(a)
// sayHello(b)
// sayHello(a + b) <-- won't work
static void sayHello(std::string& msg) {
    std::out << "sell hello: " << message << std::endl;
}

// sayHello(a)
// sayHello(b)
// sayHello(a + b) <-- will work
static void sayHello(std::string msg) {
    std::out << "sell hello: " << message << std::endl;
}

// sayHello(a + b)
// will work because we say that the anonymous object won't be changed -> cpp
// marks it as safe
static void sayHello(const std::string& msg) {
    std::out << "sell hello: " << message << std::endl;
}
```

- `LValue` = left value; left of an assignment
- `RValue` = right value; right of an assignment
    - is for
        - constants -> `const std::string& test` will also be an `RValue`
        - temporary objects
        - objects without names
    - basically `RValue` because you don't write / have the left part of the 
      assignment
    - temprary objects can be passed as parameter with an `RValue`

With overloading, you can pass both objects as "normal" reference

```cpp
    static void helper(std::string&& message) {
        sayHello(message);  // will use the lvalue method because the parameter
                            // has a reference in this context
    }

    static void helper(std::string&& message) {
        sayHello(std::move(message));   // type cast; not a method - this casts
                                        // it to an anonymous object again so
                                        // that the rvalue method
    }
```

- copy versus reference: `std::string` vs `std::string&`
    - elementar types: use copy (less instructions)
    - classes: use references (more spaces needed)
        - especially `const std::string&` since it is safe
- const vs not const: `std::string&` vs `const std::string&`
    - `const` can be faster because it is an option for the code generator to
      better optimise the code -> can use functional variants

> functional programming: don't have access to state -> can be run in parallel

## move semantics

```cpp
BigData data (10 ,1);
// both create a bit-by-bit copy ("shallow copy") -> issues with pointers
BigData tmp = data;
BigData tmp2 (data);

// note that both tmp and tmp2 are no references but "real" objects -> it
// copies a part of memory but in a "dumb" version (bit by bit)
// when leaving this scope, the deconstructor will be called for each object
// and since all objects have the same pointer -> will try to release the same
// memory are twice -> not allowed -> error
```

- `new int[10]` will be placed on the heap
- once a scope is changed/exited, the destructor for all objects will be called
  automatically
- constructors
    - copy constructor: needs to be manually written if the object contains 
      pointers (otherwise issues with pointers since the default constructor
      creates a shallow copy)
    - deconstructor: releases memory
- rules
    - rule of three: required when using dynamic data in an object
        - copy constructor
        - copy assignment
        - deconstructor
    - rule of five: required if you want to use `std::move` you have to 
      implement these parts
        - copy constructor
        - copy assignment
        - move constructor
        - move assignment
        - deconstructor
    - rule of zero
        - use containers from the standard library - they handle the memory 
          handling
- `std::move` is basically the move-constructor for simple objects

```cpp
class A {
    // ...
}

A a ();
A b = a; // <- copy constructor

A c ();
c = a; // <- assignment operator
```

```cpp
std::vector<BigData> vec;
vec.push_back(BigData(10, 1)); // <- uses the copy constructor of BigData

// what is happening
// object BigData is created on the stack
// the copy-constructor will be used to create the anonymous object

// changes with the move-constructor
BigData::BigData(BigData&& data) noexcept {
    m_data = data.m_data;   // shallow copy, data will be stripped later on
    m_size = data.m_size;

    data.m_size = 0;
    data.m_data = nullptr;  // reset source object, "ownership" has been moved
                            // the deconstructor won't do anything for 
                            // nullpointers (as defined by cpp)
}
```

- exceptions
    - with exception handling, the call stack will be complexer because the 
      exception have to be copied outside of the method
    - `noexcept` tells the compiler that there won't be an exception (yet if 
      there is one, the program will crash)
        - use `noexcept` without risks: when the function only does value 
          assignments
        - see also "Exception Safety" of the lecture

## auto

```cpp
// auto a; <-- does not compile, a needs to have a type
auto a = 123;       // <-- type deduction
auto b = 123.123;   // float or double? double because it is defined as such
auto c = 123.123f;  // float
```

> C++ has implicit and explicit type conversion. A type conversion can be done
> implicit if there won't be any information lost (or put another way, C++ will
> perform this implicit cast if no information is lost). Everything else has to
> be done explicitly: `int a = (int)123.123f`.

```cpp
// the typedef of modern cpp
using ReturnType = std::map<int, std::string>;
```

- `using` vs `auto`
    - with `auto` you have one line less; changes are "automatically"
      propagated (but then again, at one point you probably want to call 
      functions with a specific type and if this does not matches -> error)
    - `using` is the a little bit more explicit version
- note that you loose `const` and `&` when using auto
    - you have to manually add `const` and `&` - you'll get unintended copies
- `decltype` is more or less the concurrent of `auto` but usually only used
  for the generic programming

```cpp
static auto sum(float f1, float f2) {
    return f1 + f2;
}

// this won't compile
// static auto do_something(bool enabled, double b, float f) {
//     if (enabled) {
//         return b;
//     }
//
//     return f;
// }

// this will compile
static auto do_something(bool enabled, double b, float f) {
    if (enabled) {
        return (float) b;
    }

    return f;
}
```

```cpp
// decltype -> infers the type of the resulting value (which is the bigger type
// of them since it won't loose any information)
template<typename A, typename B>
static auto example(A a, B b) -> decltype(a + b)
{
    return 123.12
}

static decltype (std::declval<T> + std::declval<U>) example(A a, B b)
{
    return 123.12
}
```

```cpp
// does actually the same
std::string toString(int value);
// this is only useful for some generic stuff because it gives you a bit more
// flexibility
auto toString(int value) -> std::string;
```


```cpp
template <typename T, typename U>
decltype (std::declval<T>() + std::declval<U>()) something(bool enabled, T t, U u)
{
    if (enabled) {
        return t;
    }

    return u;
}
```

## lambdas

- basically already existing functionality but written another way
- local, anonymous classes which overload the `operator()`

```cpp
// works, but is not object-oriented
bool compare(int n1, int n2)
{
    return n1 > n2;
}

std::vector<int> vec = {10, 20, 5, 10};

std::sort(
    std::begin(vec),
    std::end(vec),
    compare
)
```

```cpp
class Comparer
{
private:
    bool m_flag;

public:
    Comparer() : m_flag{ true } {}
    Comparer(bool flag) : m_flag{ flag } {}

    // this is an "operator" which can be explicitly implemented
    // "operator()" is the name of the operator
    bool operator() (int n1, int n2) const {
        // note that this can use the fields of this object
        return (m_flag) ? n1 < n2 : n1 > n2;
    }
};

std::sort(
    std::begin(vec),
    std::end(vec),
    Comparer{}
)

std::sort(
    std::begin(vec),
    std::end(vec),
    [](int n1, int n2) const {
        return n1 < n2;
    }
)
```

```cpp
bool m_flags = false;

std::sort(
    std::begin(vec),
    std::end(vec),
    // --> pass by value; the default
    [=](int n1, int n2) const {
        return (m_flag) ? n1 > n2 : n1 < n2;
    }
    // --> pass by reference
    // [?](int n1, int n2) const {
    //     return (m_flag) ? n1 > n2 : n1 < n2;
    // }
)

std::sort(
    std::begin(vec),
    std::end(vec),
    [flag = true](int n1, int n2) const { // <-- declares the class variable flag
        return (flag) ? n1 > n2 : n1 < n2;
    }
)
```

- `[]() { /* lambda implementation */ }`: `[]` is the capture clause and
  defines what the lambda can be accessed

```cpp
// --> the operators are const by definition in cpp
auto lambda = [variable = 10] () -> int {
    return variable;
};

// --> mutable removes the const part
auto lambda = [variable = 10] () mutable -> int {
    return variable;
};

static auto test() {
    int a = 1;  // <--
    int b = 2;  // <-- will be lost when returning, leading to unknown stuff
                // when leaving this function (scope)

    auto lambda = [&] () {
        std::cout << a << " und " << b << std::endl;
    }

    return lambda;
}
```


```cpp
// no information about what happens inside the lambda or what internal values
// a lambda has -> it doesn't make sense to compare lambda types
std::function<void(int, int)> l0 = [=] (int x, int y) {
    // do something
}
```

## smart pointers

```cpp
int* ip = new int(123);
delete ip;
```

- question / issue: who owns the pointer, who calls `delete`
- new idea: similar to "RAII"
    - basis
        - in object-oriented programming, there are constructors and
          deconstructors
        - the deconstructor *will* be called (once the object falls out of the 
          scope) -> which means there is some kind of determinism
    - details
        - class to use constructor for `new` and deconstructor for `delete`
    - today
        - `std::unique_ptr`
            - at each point in time, the pointer is only allowed to have one
              owner
        - `std::shared_ptr` (and `std::weak_ptr`)
            - at each point in time, the pointer can have multiple owners
- trend today is that the pointer has a negative touch ("raw pointer")

### unique pointer

```cpp
// only to showcase that new is still used
std::unique_ptr<int> ptr1{ new int{123} };
std::unique_ptr<int> ptr1{ std::make_unique<int>(123) }
auto ptr1{ std::make_unique<int>(123) }

// in theory: you can still get the raw pointer out of it
std::cout << *ptr1 << std::endl;
int* ip1{ ptr1.get() };
(*ip1)++;
```

```cpp
std::unique_ptr<int> ptr1{ new int{123} };
std::unique_ptr<int> ptr2{ std::move(ptr1) }; // <-- move the ownership

std::cout << *ptr1 << std::endl; // this will now crash!

std::unique_ptr<int> ptr3 = std::move(ptr2);
```

```cpp
static std::unique_ptr<int> load() {
    std::unique_ptr<int> ptr{ std::make_unique<int>(100) };
    return ptr  // <-- copy and move elision; this means that the compiler
                // already optimizes the code and avoids the unnecessary 
                // temporary object on the stack
}

// the reference is obligatory since unique pointers can't be copied!
static void store(std::unique_ptr<int>& ptr)
{
    // NOTE: a subprogramm should NEVER claim the ownership of a reference
    auto val = std::move(ptr);
}

// the reference is obligatory since unique pointers can't be copied!
static void store(const std::unique_ptr<int>& ptr)
{
    // ownership can't be taken because of the const qualifier
}


// an alternative, this is allowed but not encouraged!
static void store(int* ptr)
{
    // don't delete this - the unique pointer still has the ownership
}

static void test()
{
    std::unique_ptr<int> ptr{ load() };
}
```

- note that the compiler optimizes the return values; you shouldn't interfere
  with this (see: copy and move elision, RVO (return value operation), NRVO (
  named return value operation)
- `std::unique_ptr` can also be used for resource handling - it will handle the
  releasing of resources if handled properly

### shared pointer

```cpp
// runs 2x new
std::shared_ptr<int> ptr1{ new int{ 123} };

// only calls 1x new: control block + memory for value -> runtime optimization
std::shared_ptr<int> ptr1{ std::make_shared<int>(123) };

// access value behind it
std::cout << *ptr1 << std::endl;

std::shared_ptr<int> ptr2{ ptr1 };
```

```cpp
std::weak_ptr<int> weak;

{
    std::shared_ptr<int> ptr1{ std::make_shared<int>(123) };
    weak = ptr1;
    // at this point, ptr1 has one strong and one weak reference

    // this creates another strong ref
    std::shared_ptr<int> ptr2{ weak.lock() };

    // NOTE: this is required
    if (ptr2 != nullptr) {
        // ...
    }

    // not expired
    std::cout << weak.expired() << std::endl;
}

// expired because ptr1 is out of scope -> deconstructed -> no more reference
// to dynamically allocated memory
std::cout << weak.expired() << std::endl;
```

- `std::shared_ptr`
    - a bit observer-like behaviour and structure
    - shared pointers are thread-safe -> reference count includes a mutex
    - control block
        - points to the actually allocated memory
        - contains the number of references to this memory
            - each of these shared pointers returns the same value and the same
              count of references
    - deconstructor
        - first reduces the count of strong references
        - only if the strong refernce count == 0 -> delete the related memory
    - `std::weak_ptr`
        - does not necessarily know about the memory
        - might now about the control block of the shared pointer
        - scenario
            - shared pointers are out of context -> deconstructor called
            - weak pointer still holds reference to control block
            - control block is only removed once there are **no strong and no
              weak references** anymore
- `std::unique_ptr` vs `std::shared_ptr`?
    - usually, go for unique pointer
    - use shared pointer if you have multiple owners
        - `std::shared_ptr` where you have the ownership
        - `std::weak_ptr` where you want to access an object but it's not
          necessarily clear if it still exists
        - but; shared pointers don't always work - one example is cyclic 
          pointers. For such observer-like situations:
            - subject knows visitors only via `std::weak_ptr` pointers
            - visitors know subject via `std::shared_ptr`
            - on event: `std::weak_ptr::lock()` and check if the resulting
              `std::shared_ptr` isn't a `nullptr`

```cpp
class X
{
public:
    X() : m_value{ 123 } {}
    int getValue() const { return m_value; }

private:
    int m_value;
};

std::shared_ptr<X> pA{ new X{} };
std::shared_ptr<X> pB;
std::shared_ptr<X> pC;

pB = pA;
pC = std::shared_ptr<X>(pB.get());  // <-- this should never be done - this
                                    // sets up a **new** shared pointer but
                                    // with an address that another (different)
                                    // shared pointer has/uses
pC = nullptr;                       // <-- this frees the memory area because
                                    // from the view point of pC, there aren't
                                    // any other references - it doesn't know
                                    // about pA or pB
int value = (*pB).getValue();
std::cout << "Value: " << value << std::endl;
```

```cpp
class UnsafeWatcher {
private:
    int* m_ptr;

public:
    UnsafeWatcher() : m_ptr{ nullptr } {}

    void watch(const std::shared_ptr<int>& sp)
    {
        m_ptr = sp.get();
    }

    int currentValue() const
    {
        return *m_ptr;
    }
};

void test()
{
    UnsafeWatcher watcher;

    {
        std::shared_ptr<int> sp = std::make_shared<int>(123);
        watcher.watch(sp);
        std::cout << "Value: " << watcher.currentValue() << std::endl;

        // at this point, sp falls out of the context
        // since the pointer is passed as reference, the refernce count is not
        // updated and it does not know about the watcher -> memory gets freed
    }

    // there are two options to make sure the program works
    // - switch to a shared pointer in the watcher class
    //   keeps the reference count up -> memory does not get deleted
    // - switch to a weak pointer in the watcher class
    //   then a check is necessary if the memory is still available
    std::cout << "Value: " << watcher.currentValue() << std::endl;
}
```

## initialization

```cpp
class X {
public:
    X(int);
};

X x{10};

int a{};        // 0 initialization
int a{ 1 };     // "normal" initialization

struct Test {
    int a;
    int b;
};

struct Test obj0;               // not initialized
struct Test obj1 {};
struct Test obj2 { 1, 2 };
struct Test obj2 { 2 };         // initializes only the first field to 2!

struct Test obj2 { .a = 2, .b = 2 };    // designated initializer
                                        // NOTE: they still have to be in order
```

- idea of `{}` for constructors; make it easier to distinguish between function
  calls and constructors


```cpp
class Class
{
private:
    int m_a;
    int m_b;
    std::string m_c;
public:
    Class(int a, int b, std::string c)
        : m_a{a}, m_b{b}, m_c{c} {} // <- here the constructor is used directly

    Class(int a, int b, std::string c)
    {
        // in this case, the default constructor for m_c would be called before
        // the assignment m_c = c will be done
        m_a = a;
        m_b = b;
        m_c = c;
    }
}
```

## initializer list

```cpp
static int adder (std::initializer_list<int> list)
{
    int result{};

    std::for_each(
        std::begin(list),
        std::end(list),
        [&result](int value) {
            result += value;
        }
    );

    return result;
}
```

- `std::initializer_list` allows to use at different points in the code to use
  a random amount of data of the same type in a list notation
    - data is put on the **stack**
    - does not have a `push_back` -> is more or less "static" (not a "real" STL
      container - or "lightweight" container (`begin`, `end`, `size`))
- `std::vector` does something similar - **BUT** the data lies on the *heap*
- `std::array` vs `std::vector`
    - array is fixed size
    - vector has variable size

> embedded programmers usually want to avoid the heap because it impacts 
> runtime performance (heap is slow because it needs to do `new`, `realloc`) 
> and the heap is usually limited in size

```cpp
std::vector<int> (5);   // => { 0, 0, 0, 0, 0 }
std::vector<int> { 5 }; // => { 5 }
```

## iterators

```cpp
std::vector<int> vec{ 1, 2, 3, 4 };
std::vector<int>::iterator pos = vec.begin();

std::cout << *pos << std::endl; // -> 1
pos++;
std::cout << *pos << std::endl; // -> 2

if (pos == vec.end()) {
    return
}


auto pos = vec.begin();
auto posEnd = vec.end();

while (pos != end) {
    int value = pos;
    ++pos;
}

static void printme(int m) {
    std::cout << int << std::endl;
}

// c++ classic
std::for_each(
    vec.begin(),
    vec.end(),
    printme
);

// c++ modern
std::for_each(
    vec.begin(),
    vec.end(),
    [](int n) {
        std::cout << n << std::endl;
    }
);

// c++ very modern
for(auto n : vec) {
    std::cout << n << std::endl;
}
```

```cpp
std::map<int, int> data;
data[1] = 10;
data[2] = 20;

std::for_each(
    data.begin(),
    data.end(),
    [](auto n) {
        std::cout << n.first << " " << n.second << std::endl;
    }
);

for(const auto& n : vec) { // <-- const auto& because auto loses the modifiers
    std::cout << n.first << " " << n.second << std::endl;
}
```

> Each STL container has to implement `.begin()` and `.end()`. To unify the
> usage of containers, the `iterator` has been defined.

## range based loop

```cpp
// c style
// does not work on all STL containers because not every container does 
// implement it
for (size_t i = 0; i != vec.size(); ++i) {
    std::cout << vec[i] << std::endl;
}
```

## utility classes

```cpp
std::optional<int> value;
value = 123;

value = std::nullopt; // reset the data

value = 123;
if (value.has_value()) {
    std::cout << value.value() << std::endl;
    // similar to smart pointer, equivalent notation
    std::cout << *value << std::endl;
}

std::variant<int, double, std::string> data{ 123 };
size_t index{ var.index() };
int a{ std::get<int>(var) };
int b{ std::get<0>(var) };

data = std::string{ "hello" };
```

- `std::optional`: track if variables are set / valid
    - think of it as class which has a `bool` inside that tracks this
- `std::variant`: can hold multiple types of values (but only the ones you 
  specified

```cpp
std::variant<int, double, std::string> value{ 123 };

// every lambda with at least one auto parameter is called "generic lambda"
// for every call with a different type, c++ generates a different machine 
// codes - note that this "simply" increases the size of the machine code. The
// code is still optimized for every type
auto visitor = [](const auto& elem) {
    std::cout << elem << std::endl;
}

// c++ has mini-reflection
auto visitor = [](auto elem) {
    if (std::is_same<decltype (elem), int>::value) {
        // do something
    }
}

auto visitor = [](auto& elem) {
    if (std::is_same<decltype (elem), int&>::value) {
        // do something
    }
}

auto visitor = [](auto& elem) {
    using Type = std::remove_reference<decltype(elem)>::type;

    if (std::is_same<Type, int>::value) {
        // do something
    }
}

auto visitor = [](const auto& elem) {
    using Type = std::remove_const<std::remove_reference<decltype(elem)>::type>::type;

    if (std::is_same<Type, int>::value) {
        // do something
    } else if (std::is_same<Type, std::string>::value) {
        std::cout << elem << std::endl;
        std::cout << elem.size() << std::endl;  // <-- does not compile because
                                                // we have the code 3 times and
                                                // for int "size()" is not
                                                // defined
                                                // that's why a runtime if was
                                                // added to the language
    }
}

auto visitor = [](const auto& elem) {
    using Type = std::remove_const<std::remove_reference<decltype(elem)>::type>::type;

    if constexpr (std::is_same<Type, int>::value) {
        // do something
    } else if constexpr (std::is_same<Type, std::string>::value) {
        std::cout << elem << std::endl;
        std::cout << elem.size() << std::endl;  // <-- now this works
    }
}

std::visit(visitor, value);
```

- c++ has primary templates and template specialization (similar to function
  overloading)
    - generic template: `template<typename A, typename B>`
    - specialization: `template<>` with `void printer<int>(int a)`
        - `typename A` is lost

## templates

```cpp
template <typename T>
void printer(T n)
{
    std::cout << n << std::endl;
}

template <typename T, typename... TArgs>
void printer(T n, TArgs... args)   // ... m packs the values into a new object
{
    std::cout << n << std::endl;

    printer(args...);              // at this point, we then need to unpack it
                                    // here it also uses type deduction

    printer<TArgs...>(args...);   // you can also unpack the types to be very
                                    // explicit about the types
}

template <typename... TArgs>
void printer(TArgs... args)    // ... m packs the values into a new object
{
    if constexpr (sizeof ... (args) > 0) {  // check we still have objects
        // do something
    }
}

static void test_printer_seminar()
{
    // printer(1, 2, 3, 4, 5);      // <-- also works through type deduction
    printer<int, int, int, int, int>(1, 2, 3, 4, 5);
}
```

- packing together multiple values: **parameter pack**
- if you have multiple functions, non-variadic functions will be prioritized
    - makes it clear which has precedence with the following functions
        - `void print(int m)`
        - `void print(T n, TArgs ... args)`

```cpp
template <typename T, typename TArgs>
std::unique_ptr<T> my_make_unique(TArgs... args)
{
    std::unique_ptr<T> ptr { new T { args... } };
    return ptr;
}

void test_make_unique()
{
    // somewhere there is class Unknown
    std::unique_ptr<Unknown> ptr1 = std::make_unique<Unknown>(10, 12, 13);
    std::unique_ptr<Unknown> ptr2 = my_make_unique<Unknown>(10, 12, 13);
}
```

- `std::vector` has a method `emplace_back` which takes variadic arguments - it
  allows to construct the element in-place -> no copies between stack and heap

## variadic templates

```cpp
template <typename T>
void doSomething(const T& value) {
    std::cout << "got value " << value << std::endl;
}

template <typename... TArgs>
void doSomethingForAll(const TArgs& ... args) {
    // this makes use of the sequence (,) operator
    // in part in () is a sequence with the value 0 because the last element
    // of the sequence is 0
    std::initializer_list<int> { (doSomething(args), 0)... };
}
```

Note that there is no such simple thing as in go:

```go
func sayHello(names ...string) {
	for _, n := range names {
		fmt.Printf("Hello %s\n", n)
	}
}
```

## algorithms

```cpp
void test_generate()
{
    std::vector<int> numbers (10);

    std::for_each(
        numbers.begin(),
        numbers.end(),
        [](int n){
            std::cout << n << std:endl;
        }
    );

    std::fill(
        numbers.begin(),
        numbers.end(),
        10
    );

    std::generate(
        numbers.begin(),
        numbers.end(),
        [](int n){
            return 111;
        }
    );

    // basically the same as the above lambda used in generate
    std::for_each(
        numbers.begin(),
        numbers.end(),
        [start = 0](int& n) mutable {
            start++;
            n = start;
        }
    );
}
```

- `std::fill` vs for-each loop
    - always use `std::fill` because the compiler can/does optimize better
- `std::generate` vs `std::for_each`
    - `std::generate` *overwrites* the container content
    - `std::for_each` has actual access to the container content and works
      with/on/transforms it

```cpp
std::generate(
    numbers.begin(),
    numbers.end(),
    [start = 0](int n) mutable -> int {
        start++;
        return start
    }
);
```

> short circuit evaluation: only evaluate expressions as far as necessary

## constexpr

- `constexpr` will be executed by the translator - everything will be done at
  runtime
    - interesting for embedded usecases
    - interesting for usecases/algorithms that have no runtime-component
    - classes, objects and functions can be executed during translation
    - example usecase: CRC calculation (see example below)
    - references: [c++ stories // constexpr dynamic memory allocation](https://www.cppstories.com/2021/constexpr-new-cpp20/)
- `const`: value not allowed to change -> compiler can use information to
  optimize stuff
- `consteval`: forces calls to be run at translation time
- `constinit`: forces initialization during translation - no dynamic
  initialization necessary -> faster
    - this can also be used to avoid problems when you have issues with the 
      initialization order

All these `const*` have the benefit that you can write/generate things with
the usual language tools (think of `go generate` but you have the generation
part directly in code and not the generated code itself).

> `static_assert` is checked as part of the compilation - this won't be in the
> binary.

```cpp
auto constexpr table = []{
    std::array<int> table;
    // calculate the CRC table
    return table;
}();
```

## perfect forwarding

```cpp
template <typename T, typename... TArgs>
std::unique_ptr<T> my_make_unique(TArgs&&... args)  // <-- this is not an 
                                                    // r-value reference
{
    std::unique_ptr<T> ptr{ new T { args... } };
    return ptr;
}
```

```cpp
// TODO: check if this is correct
template <typename T, typename... TArgs>
std::unique_ptr<T> my_make_unique(TArgs&&... args)
{
    std::unique_ptr<T> ptr{
        new T { std::forwared<TArgs>(args)... }
    };
    return ptr;
}
```

## concepts / requirements

```cpp
// history
// for T everything is allowed which supports the expression "a + b"
// however, this is a reactive behaviour - it's no proactive
template <typename T>
auto add(T a, T b)
{
    return a + b;
}

// modern, proactive approach with all the options
using <concepts>
template <typename T>
concept Numerical = std::integral<T> || std::floating_point<T>;

using <type_traits>
template <typename T>
concept NumericalEx = std::is_integral<T>::value || std::is_floating_point<T>::value;

template <typename T> requires Numerical<T>
auto add(T a, T b)
{
    return a + b;
}

template <typename T>
auto add(T a, T b) requires Numerical<T>
{
    return a + b;
}

template <Numerical T>  // NOTE: in this version, you can't use ||
auto add(T a, T b)
{
    return a + b;
}

// internally, this is still a template
auto add(Numerical auto a, Numerical auto b)
{
    return a + b;
}
```

```cpp
// you can also write relativly freely your own concepts
template<typename T>
constexpr bool isGreaterThanWord{ sizeof(T) > 2 };

// using <type_traits>
template <typename T>
concept GreatIntegral = std::is_integral<T>::value && isGreaterThanWord<T>;

// this could be used like this:
template<GreatIntegral T>
T incrementByOne(const T& arg) {
    return arg + 1;
}

// also works even without <T>
auto incrementByOne2(GreatIntegral auto arg) {
    return arg + 1;
}
```

## structured binding

- works starting from c++17
- problem: multiple return values; available for `std::pair`, `std::tuple`, 
  `struct` or `fields` with fixed lengths
- `std::tie`; the "little" structured binding

```cpp
std::pair<int, int> test() {
    return std::pair<int, int>{ 1, 2 };
}

auto [ quotient, divider ] = test(); 

int arr[3] = { 123, 456, 678 };
auto [ a, b, c ] = arr;
a = 999;
std::cout << arr[0] << std::endl;   // <-- since auto looses reference, this 
                                    // won't have changed

int arr[3] = { 123, 456, 678 };
auto& [ a, b, c ] = arr;
a = 999;
std::cout << arr[0] << std::endl;   // <-- this now will be also 999
```

## attributes

```cpp
[[ deprecated ]] int test1() {
    return 1;
}

[[ nodiscard ]] int test2() { // does not allow you to discard the value
    return 1;
}

test1(); // <-- by default, deprecated generates a warning
test2(); // <-- generates a warning due to the nodiscard attribute
```

## folding

- repeated appliance of an operator
- promise that the code will be performant
- there are different type of folds
    - unary right fold `(E op ...)` becomes `(E1 op (... op (EN-1 op EN)))`
    - unary left fold `(... op E)` becomes `(((E1 op E2) op ...) op EN)`
    - binary right fold `(E op ... op I)` becomes `(E1 op (... op (EN−1 op (EN op I))))`
    - binary left fold `(I op ... op E)` becomes `((((I op E1) op E2) op ...) op EN)`

```cpp
template <typename... TArgs>        // usual variadic template parts
auto addierer(TArgs... args) {      // usual variadic template parts

    auto result = ( ... + args );   // <-- folding

    return result;
}

template <typename... TArgs>
auto subtrahieren(TArgs... args) {

    auto result = ( ... - args );
    // auto result = ( args - ... );    // <-- uses the right fold which uses
                                        // the parentheses differently

    return result;
}

auto subtrahieren(std::integral auto ... args) {
// auto subtrahieren(auto ... args) {               // or even simpler
    return ( args - ... );
}

auto printer(auto first, auto ... args) {
    // (std::cout << ... << args);          // first draft - spaces are missing

    std::cout << first;
    (... , ( std::cout << args << " - " )); // <-- sequential operator
}

void folding() {
    addierer(1, 2, 3, 4, 5, 6);
    subtrahierer(1, 2, 3, 4, 5, 6);     // <-- note that in this example the 
                                        // order of parentheses matters
    printer(1, 2.0, "hello");
}
```

## type erasure

```cpp
std::vector<std::variant<int, long, float, double>> vect = {
    1, 2l, 3.0f, 4.1
};
```

- example scenario: define bookstore
    - mix of different classes; books and movies
- other tools to replace the "old" interfaces
    - `concept`, `std::variant` vs interfaces
    - runtime comparison: no clear winner, depends on what you do
        - add items
        - access items

> type erasure: classes don't use base classes (but note that `std::variant`
> uses helper base classes inside).

> duck typing: if I see a bird behaving like a duck, I call it a duck.

```cpp
class Book { /* ... */ };

class Movie { /* ... */ };

// ===========================================================================
// this creates a similar public contract like interfaces
template<typename T>
concept MediaConcept = requires (const T & m)
{
    { m.getPrice() } -> std::same_as<double>;
    { m.getCount() } -> std::same_as<size_t>;
};

template <typename ... TMedia>
    requires (MediaConcept<TMedia> && ...)  // <-- folding used to ensure that
                                            // all TMedia fulfill the 
                                            // MediaConcept concept
// ===========================================================================

class Bookstore
{
private:
    using Stock = std::vector<std::variant<TMedia ...>>;
    using StockList = std::initializer_list<std::variant<TMedia ...>>;

public:
    explicit Bookstore(StockList stock) : m_stock{ stock } {}

    // template member method
    template <typename T>
    void addMedia(const T& media) {
        // m_stock.push_back(std::variant<TMedia ...>{ media });  // ausführliche Schreibweise
        m_stock.push_back(media);
    }

    // or
    void addMediaEx(const auto& media) {
        m_stock.push_back(media);
    }

    double totalBalance() {
        double total{};

        for (const auto& media : m_stock) {
            double price{};
            size_t count{};

            std::visit(
                [&](const auto& element) {          // <-- element is of type
                                                    // book **OR** movie, 
                                                    // depending on what there
                                                    // is in the variant
                    price = element.getPrice();
                    count = element.getCount();

                    // historically, this was usually done with interfaces
                    // this forces you to implement the interface methods
                    // **BUT** when working with interfaces, you have to work
                    // with pointers and need to dereference before being able
                    // to access the values

                    // interfaces -> some kind of explicit, public contract

                    // in modern cpp, you do this with concepts where you don't
                    // need to dereference - you have direct access to the 
                    // element
                },
                media
            );
            total += price * count;
        }
        return total;
    }

    size_t count() {
        size_t total{};
        for (const auto& media : m_stock) {
            size_t count{};
            std::visit(
                [&](const auto& element) {
                    count = element.getCount();
                },
                media
            );
            total += count;
        }
        return total;
    }

    double totalBalanceEx() {
        double total{};
        for (const auto& media : m_stock) {
            // visit returns the return value of the lambda
            total += std::visit(
                [](const auto& element) {
                    double price = element.getPrice();
                    size_t count = element.getCount();
                    return price * count;
                },
                media
            );
        }
        return total;
    }

    size_t countEx() {
        size_t total{};
        for (const auto& element : m_stock) {
            total += std::visit(
                [](const auto& element) {
                    return element.getCount();
                },
                element
            );
        }
        return total;
    }

private:
    Stock m_stock;
};
```

## multithreading

- identify thread: os gives each thread an ID

```cpp
void test()
{
    // do something
}

// when falling out of scope, the threads are also removed from stack
// if you don't call join or detach **before**, it will throw an error

std::thread t1{ test, 1 };
std::thread t2{ test, 2 };

t1.join(); // blocking
t2.join();

// threads runs at most as long as the primary thread is running
// t1.detach();     // non-blocking
// t2.detach();
```

- 4 methods to generate a thread
    - with pointer
    - with callable object
    - with lambda
    - with method of an object
- RAII: use a simple object to use the constructor / deconstructor to lock and
  unlock an mutex
    - different type of locks; `std::unique_lock`, `std::defer_lock`, ...
- "normal" thread vs thread of a pool
    - "normal" thread has a big overhead because it needs to be scheduled,
      parameters need to be allocated, ... -> and can only be executed once
    - thread pool: threads are "sleeping" until one is requested

> raii: resource acquisition is initialization

```cpp
std::mutex s_mutex{};

// braces now serve two functions
// - call constructor and deconstructor
// - provide a visual indication for this
{
    std::lock_guard<std::mutex> tmp{ s_mutex };
    // do something
    // lock is automatically released
}
```

### promises

```cpp
std::string hello(std::string s)
{
    return s;
}

// no run, no join or detach necessary - the thread automatically runs
std::future<std::string> f1{std::async(hello, "f1")};
std::future<std::string> f2{std::async(hello, "f2")};

std::cout << f1.get() << std::endl;     // blocks until the result is there
                                        // => potentially blocking
std::cout << f2.get() << std::endl;
```

### `std::condition_variable`

- polling is bad, there is another concept: notification

```cpp

bool data{ false };

{
    std::condition_variable condition{};
    std::unique_lock<std::mutex> guard{ mutex };
    
    // - wait is blocking
    // - wait wakes up
    //   - can be woken up with "notify"
    //   - also wakes up implicitly (sporadic)
    condition.wait(
        guard,
        []() -> bool {
            // when the lambda is entered, it takes the mutex
            std::cout << "here" << std::endl;
            return data = true;
            // when leaving the lambda, the mutex is released
        }
    );
}

{
    // in another thread
    {
        std::unique_lock<std::mutex> guard{ mutex };
        data = true;
    }

    // solves the block in the "condition.wait"
    condition.notify_one();
}
```

## best practices

(in the context of modern c++)

- use STL: container, algorithms, ...; `std::for_each` instead of `for ( xxx )`
- use smart instead of raw pointer; `std::unique_ptr` / `std::shared_ptr`
- use RAII
- c++ has multiple levels of exception safety
    - no exception safety: no guarantees; everything can happen if an error
      occurs
    - basic exception safety
        - no resources are lost -> cleanup is done, no leaks
        - all saved data contains valid data (but it can deviate from the 
          original data)
    - strong exception safety
        - if an exception occurs, the object is left in the same status as
          before trying to perform an operation
        - copy and swap idiom
    - no-throw guarantee
        - operation can/will not throw an exception -> see constructors
- if you use template functions, use concepts to ensure you only get the 
  expected types

## friend

- `friend`: grants a specific function access to a private/protected member of
  a class

```cpp
class FirstClass
{
    friend std::ostream& operator<< (std::ostream& os, const FirstClass& obj);

private:
    int m_x;

public:
    int getValue() const { return m_x; }    // const to specify that the object
                                            // won't be changed
};

std::ostream& operator<< (std::ostream& os, const FirstClass& obj) {
    os << obj.get_value();      // works

    os << obj.m_x;              // with "friend" this now also works

    return os;
}

void test() {
    FirstClass fc;

    // for printing objects, you need to implement the operator
    std::cout << fc << std::endl;
}
```

## stringview

- `std::string_view`: for constant strings which avoids the data to be on heap

```cpp
// on heap
std::string a{ "hello heap" };

// not on the heap
std::string_view c{ "hello stack" };
```

## resources

- [cpp modern](https://github.com/pelocpp/cpp_modern)
- [cpp concurrency](https://github.com/pelocpp/cpp_concurrency)
- [cpp design patterns](https://github.com/pelocpp/cpp_design_patterns)
