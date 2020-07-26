# null-coalescing operator

The null-coalescing operator `??` is useful for simple null-checks. It is
written like so, `a ?? b`, where `b` often is a "default" expression that should
be returned if `a` is `null`.

In this example the null-coalescing operator isn't use, and instead a longer
if-statement has to be used:

```csharp
string a = null;

if (a != null)
{
	return a;
}
else
{
	return "Default value";
}
```

But when the null-coalescing operator is used it can be delightfully short:

```csharp
string a = null;

return a ?? "Default value";
```

Some of the more experienced readers might have thought of a way that we can
write this example on one line without the null-coalescing operator, by using
the conditional operator (`?:`) instead.

```csharp
string a = null;

return a != null ? a : "Default value";
```

But notice that `a` is present twice in that expression. If instead of a
variable, `a` was replaced with an expression that had to be evaluated. Then
that evaluation would have to happen twice if it didn't evaluate to `null`.

--------------------------------------------------------------------------------

Another use case where the null-coalescing operator can replace conventional
null-checks is when null-checking arguments provided to a method (or
constructor). In many such case, instead of using default value an exception is
thrown.

Imagine that `aString` in this class can't be `null`, so we must check that when
assigning to it in the constructor.

```csharp
class Klass
{
	public string aString { get; }

	public Klass(string aString)
	{
		this.aString = aString ?? throw new ArgumentNullException();
	}
}

return new Klass(null);
```

Now that looks clean. And imagine if `Klass` had more properties that needed
null-checking, and how much more code that would require.