#### First for all, Hi my buddy, I talk a bit about this issue shows with me

### `Cast to ObjectId failed for value "" (type string) at path "_id" for model "page"` 

this bug shows to me when I post without adding title if I am editing a page, then modify the slug and write a title then post again, this error shows `Cast to ObjectId failed for value "" (type string) at path "_id" for model "page"` ? 

let's find where is the probem.
error occurs because, when validatoin fails in `doRendering`, the `id` field in `req.body` is lost or set to an empty string. Then you try to submit again `id` is missing, causing MOngosse to throw ` Cast to ObjectId failed for value "" `.

### First: 
- I should mention that I am using hidden input that hold the page `id` and when I submit the form the `id` of this page sent in the `req.body`.
    ```html
    <input type="hidden" name="id" value="<%= pageToEdit._id %>">
    ```

### Second:
**let's know the difference between `pageToEdit.id` and `pageToEdit._id`.**

1. `pageToEdit.id`
- Mongoose automatically provides a virtual property `id`, which is a **string representation** of `_id` (which is an `ObjectId`).
- When You access `pageToEdit.id`, it's always a string, and HTML form fields require string values.
- Since `req.body.id` is directly assigned form the input field in the form, it remains a string when sent back in the request.


2. `pageToEdit._id`
- `_id` is stored as **MongoDB ObjectId**, which is an `object, not a string`.
- When Mongoose queries a document, `_id` remains an `ObjectId`, unless converted explicitly.
- if `_id` is passed directly to the form as `<%= pageToEdit._id %>`, it might cause inconsistencies when submitting the form.

---

### How does this affect the Issue ?
when validation fails and the form is re-rendered:
1. if you use `_id`, it might be lost `""` or become `undefiened` because `req.body` dose not include `_id` unless explicitly set.
2. if you use `id`, it's a sager choice since it's always a **string** in Mongoose and won't cause issues when reassigning it back to `req.body.id`.

---

<br>

## Best Practice: Always Use `id` in Forms
Since Mongoose automatically provides `id` as stirng, it's **more reliable** in forms:
```html
<input type="hidden" name="id" value="<%= pageToEdit.id %>">
```

---


