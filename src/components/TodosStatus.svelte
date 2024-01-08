<!-- components/TodosStatus.svelte -->
<script>
  export let todos

  $: totalTodos = todos.length
  $: completedTodos = todos.filter(todo => todo.completed).length

  let headingEl

  export const focus = () => headingEl.focus()

</script>

<h2 id="list-heading" bind:this={headingEl} tabindex="-1">待办完成度：{completedTodos}/{totalTodos}</h2>
