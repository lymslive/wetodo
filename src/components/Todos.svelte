<!-- components/Todos.svelte -->
<script>
  import FilterButton from './FilterButton.svelte'
  import Todo from './Todo.svelte'
  import MoreActions from './MoreActions.svelte'
  import NewTodo from './NewTodo.svelte'
  import TodosStatus from './TodosStatus.svelte'
  import { alert } from '../stores.js'

  export let todos = []

  let todosStatus                   // reference to TodosStatus instance

  $: newTodoId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1

  function addTodo(name) {
    todos = [...todos, { id: newTodoId, name, completed: false }]
    $alert = `添加待办：${name}`
  }

  function removeTodo(todo) {
    todos = todos.filter(t => t.id !== todo.id)
    todosStatus.focus()             // give focus to status heading
    $alert = `删除待办：${todo.name}`
  }

  function updateTodo(todo) {
    const i = todos.findIndex(t => t.id === todo.id)
    if (todos[i].name !== todo.name) {
      $alert = `待办项（${todos[i].name}）更名为（${todo.name}）`
    }
    if (todos[i].completed !== todo.completed){
      $alert = `待办项（${todos[i].name}）标记为： ${todo.completed ? '已完成 ' : '未完成'}`
    }
    todos[i] = { ...todos[i], ...todo }
  }

  let filter = 'all'
  const filterTodos = (filter, todos) => 
    filter === 'active' ? todos.filter(t => !t.completed) :
    filter === 'completed' ? todos.filter(t => t.completed) : 
    todos

  $: {
    if (filter === 'all')               $alert = '查看所有待办项'
    else if (filter === 'active')       $alert = '查看未完成项'
    else if (filter === 'completed')    $alert = '查看已完成项'
  }

  const checkAllTodos = (completed) => {
    todos = todos.map(t => ({...t, completed}))
    $alert = `${completed ? '完成' : '激活'} ${todos.length} 所有待办项`
  }
  const removeCompletedTodos = () => {
    $alert = `删除 ${todos.filter(t => t.completed).length} 项待办`
    todos = todos.filter(t => !t.completed)
  }

</script>

<div class="todoapp stack-large">

  <!-- NewTodo -->
  <NewTodo autofocus on:addTodo={e => addTodo(e.detail)} />

  <!-- Filter -->
  <FilterButton bind:filter />

  <!-- TodosStatus -->
  <TodosStatus bind:this={todosStatus} {todos} />

  <!-- Todos -->
  <ul role="list" class="todo-list stack-large" aria-labelledby="list-heading">
  {#each filterTodos(filter, todos) as todo (todo.id)}
    <li class="todo">
      <Todo {todo}
        on:update={e => updateTodo(e.detail)}
        on:remove={e => removeTodo(e.detail)}
      />
    </li>
  {:else}
    <li>没有满足条件的待办项</li>
  {/each}
  </ul>

  <hr />

  <!-- MoreActions -->
  <MoreActions {todos}
    on:checkAll={e => checkAllTodos(e.detail)}
    on:removeCompleted={removeCompletedTodos}
  />

</div>
