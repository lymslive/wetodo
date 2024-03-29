<!-- components/Todo.svelte -->
<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { selectOnFocus } from '../actions.js'

  export let todo

  let editing = false                     // track editing mode
  let editButtonPressed = false           // track if edit button has been pressed, to give focus to it after cancel or save

  let name = todo.name                    // hold the name of the todo being edited

  // disable remove button for short seconds after save
  let disableRemove = false;
  let timeoutRemove = null;
  const disableTime = 5 * 1000;

  function update(updatedTodo) {
    todo = { ...todo, ...updatedTodo }    // applies modifications to todo
    dispatch('update', todo)              // emit update event
  }

  function onCancel() {
    name = todo.name                      // restores name to its initial value
    editing = false                       // and exit editing mode
  }

  function onSave() {
    update({ name: name })                // updates todo name
    editing = false                       // and exit editing mode

    disableRemove = true;
    timeoutRemove = setTimeout(() => {
      disableRemove = false;
      clearTimeout(timeoutRemove);
    }, disableTime);
  }

  function onRemove() {
    dispatch('remove', todo)              // emit remove event
  }

  function onEdit() {
    editButtonPressed = true              // when Cancel or Save is pressed, focus should go back to the Edit button
    editing = true                        // enter editing mode
  }

  function onToggle() {
    update({ completed: !todo.completed}) // updates todo status
  }

  const focusOnInit = (node) => node && typeof node.focus === 'function' && node.focus()

  const focusEditButton = (node) => editButtonPressed && node.focus()

</script>

<div class="stack-small">
{#if editing}
  <!-- markup for editing todo: label, input text, Cancel and Save Button -->
  <form on:submit|preventDefault={onSave} class="stack-small" on:keydown={e => e.key === 'Escape' && onCancel()}>
    <div class="form-group c-cb">
      <input type="checkbox" checked={todo.completed} />
      <input bind:value={name} use:selectOnFocus use:focusOnInit type="text" id="todo-{todo.id}" autoComplete="off" class="todo-text" />
      <button class="btn todo-cancel" on:click={onCancel} type="button">
        取消<span class="visually-hidden">renaming {todo.name}</span>
      </button>
      <button class="btn btn__primary todo-edit" type="submit" disabled={!name}>
        保存<span class="visually-hidden">new name for {todo.name}</span>
      </button>
    </div>
  </form>
{:else}
  <!-- markup for displaying todo: checkbox, label, Edit and Delete Button -->
  <div class="c-cb">
    <input type="checkbox" id="todo-{todo.id}"
      on:click={onToggle} checked={todo.completed}
    />
    <label for="todo-{todo.id}" class="todo-label">{todo.name}</label>
    <button type="button" class="btn" on:click={onEdit} use:focusEditButton>
      修改<span class="visually-hidden"> {todo.name}</span>
    </button>
    <button type="button" class="btn btn__danger" on:click={onRemove} disabled={disableRemove}>
      删除<span class="visually-hidden"> {todo.name}</span>
    </button>
  </div>
{/if}
</div>
