## Handling Slugify Errors

The question is when does slugify fali? let's see

### When Does Slugify Fail?

1.  **Title is Empty:** `slugify('')` returns an empty string.
2.  **Title has Special Characters:** if strict mode (`strict: true`) is on, it removes all non-alphanumeric characters. So, if only Special characters exist, it might return an empty slug.
3.  **Invalid Input Type:** if `slugify(undefined)` or `slugify(null)` is called, it eturns an empty string (`""`).

.

<br>

---



