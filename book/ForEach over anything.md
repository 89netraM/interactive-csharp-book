# `foreach` over anything

We usually use `foreach`-loops with `IEnumerable`s, but that's not really a
requirement.

All an object need for a `foreach`-loop to work with it is a public method
called `GetEnumerator()` that returns some type with a public property `Current`
and a public method `MoveNext()` that returns a boolean.

This is exactly what's required to implement `IEnumerable`, but implementing
`IEnumerable` isn't necessary to work with `foreach`-loops.

```csharp
class ForEachable
{
	public Iterator GetEnumerator()
	{
		return new Iterator();
	}
}
class Iterator
{
	public int Current { get; private set; } = 0;

	public bool MoveNext()
	{
		if (Current < 4)
		{
			Current++;
			return true;
		}
		else
		{
			return false;
		}
	}
}

foreach (int i in new ForEachable())
{
	Console.WriteLine("Number: " + i);
}
```

This is good and all, but more often than not it's better to actually implement
`IEnumerable`. Without doing so you loose access to the useful LINQ methods.