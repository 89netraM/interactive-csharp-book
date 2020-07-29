# Tupleize <small>(deconstructors)</small>

Tuples are great. An especially the deconstruction of them. No, not like that.
Tuple deconstruction is when you assign an `n`-tuple to `n` different variables
and thus getting easy access to the tuples values.

```csharp
ValueTuple<string, int, bool> tuple = ("Hello", 42, false);
Console.WriteLine(tuple.Item1); // Accessing the first item

var (s, i, b) = tuple; // Deconstruction
Console.WriteLine(s); // Now has the value of the tuples first item
```

Now the fun thing is, deconstructors aren't exclusive to tuples. In fact, you
can write deconstructors for your own types.

All you need to do to allow deconstruction of your own types is to define a
method called `Deconstruct` with an `out` parameter for each property you want
to include in the tuple.

```csharp
class Address
{
	public string Street { get; set; }
	public int StreetNumber { get; set; }
	public bool IsApartment { get; set; }

	public Address(string street, int streetNumber, bool isApartment)
	{
		Street = street;
		StreetNumber = streetNumber;
		IsApartment = isApartment;
	}

	public void Deconstruct(out string street, out int streetNumber, out bool isApartment)
	{
		street = Street;
		streetNumber = StreetNumber;
		isApartment = IsApartment;
	}
}

Address address = new Address("Hello", 42, false);
var (street, streetNumber, isApartment) = address;
Console.WriteLine("{0}, {1}, {2}", street, streetNumber, isApartment);
```

Here a deconstructor that outputs a `3`-tuple is defined. Several deconstructors
can be defined on the same type as long as they have a different numbers of
parameters.

--------------------------------------------------------------------------------

You can define two deconstructors with the same number of parameters but
different types, but you probably shouldn't. It can causes problems when trying
to deconstruct the type to a tuple defined with `var` instead of actual types
since the compiler can't know which deconstructor to use.

--------------------------------------------------------------------------------

You can also define deconstructors as extension methods. For when you don't want
to or can't change an existing class.  
Just write a regular extension method, and call it `Deconstruct` and with all
the same arguments as in the example above.