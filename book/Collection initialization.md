# Collection initialization

Most readers have probably come in contact with collection initializers when
initializing `List`s. For those that haven't (or those that don't know the
fancy name), here's an example:

```csharp
List<int> numbers = new List<int> { 0, 13, 42, 64, 128 };

return numbers;
```

After running this, `numbers` will be a `List<int>` containing all the specified
integers.

What many don't know is how this works. But there's not much magic, just a
teensy weensy bit. Under the hood, the constructor is first called without
any arguments, and then the `Add` method is called once for each item in the
collection initializer.

The magic here is that if you create a class that follow just two rules the
collection initializer will work for your class too.

1. The class must implement `IEnumerable<T>`
2. The class must have a method `Add` defined that takes one argument of type
   `T` and returns `void`.

That's it. Take a look at this example.

```csharp
class NumberCollection : IEnumerable<int>
{
	private readonly List<int> internalNumbers = new List<int>();

	public void Add(int number)
	{
		internalNumbers.Add(number);
	}

	public IEnumerator<int> GetEnumerator() => internalNumbers.GetEnumerator();
	IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

NumberCollection numbers = new NumberCollection { 0, 13, 42, 64, 128 };
return numbers;
```

Now I'm sure you can come up with a lot more imaginative purposes than a wrapper
around another list. One thing you could do is to create a tree, something which
requirers a bit more logic in the `Add` method.