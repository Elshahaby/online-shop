### First of All, Hi dude, How you doing?

### The issue that I will talk about it, it is as follows: At any edit page when any unvalid input is put and then I hit submit button of the form in this edit page the flash message error shows after I hit the button twice not at first hit. 

- in short phrase, **Issue: Session-Based Flash Messages Disappear Too Soon**

If you're using `express-session` and `connect-flash` to display error messages, you might notice that error messages disappear too quickly—often right after a form submission.

### 🔴 The Problem

```ts
req.flash("error", "Something went wrong!");
res.redirect("/admin/pages/editPage/" + req.body.id);
```

**What is happening?**
- `req.flash("error", "Something went wrong!")` stores the error message in the session.
- `res.redirect(...)` immediately refreshes the page.
- When the page reloads, `connect-flash` retrieves and removes the message from the session.
- If the user dosen't see the message on the next request (e.g because of a fast reload), the message is lost.


### ✅ The Fix: Use `res.render` Instead of `res.redirect` and must pass `error: req.flash('erros')` 

```ts
req.flash("error", "Something went wrong!");
res.render("editPage", { error: req.flash("error"), userInput: req.body });
```

**Why does this Work**
- 'res.render(...)' renders the page without refreshing it, keeping the flash message available.
- This ensures the error message remains visivle for the user on their first submit attempt.
- `req.body` is also passed back to preserve form inputs, preventing data loss.

### 🚀 Best Practice
- Use `res.redirect(...)` for success messages (because they persist across pages) and `res.render(...)` for error messages (so they remain visible on the same page).

---

**same problem happens with render if I don't pass the `errors: req.flash('erros')` with `render(..., { ... })` **

If you don’t explicitly pass `errors: req.flash('errors')` to `res.render(...)`, the error messages won't be available in the template.

**Why?**

- `req.flash("errors", .... )` stores the errors in session memory.
- But flash messages are only available for the next request and are cleared once accessed.
- If you don't pass `errors: req.flash("errors")` to `res.render(...)`, the view won't receive the errors, and they will be lost.

---

### ✅ Correct Fix: Always Pass Errors

Instead of this ❌ (which loses errors):
```ts
req.flash("errors", ["Something went wrong!"]);
res.render("editPage", { userInput: req.body }); // No 'errors' passed
```

Do This ✅:
``` ts
req.flash("errors", ["Something went wrong!"]);
res.render("editPage", { errors: req.flash("errors"), userInput: req.body });
```

**🛠 How This Fix Works**
- `req.flash("errors", [...])` stores the error messages.
- `req.flash("errors")` retrieves and clears them.
- Passing `errors` ensures the template receives the messages before they disappear.
 
 ---

**🚀 Key Takeaway**
🔹 Always pass `errors: req.flash("errors")` to `res.render(...)`, or else flash messages won’t persist.