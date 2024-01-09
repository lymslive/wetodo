// stores.js
import { writable } from 'svelte/store'
import { localStore } from './localStore.js'

export const alert = writable('欢迎使用待办事项备忘录小工具')

const initialTodos = [
  { id: 1, name: '吃饭', completed: true },
  { id: 2, name: '睡觉', completed: false },
  { id: 3, name: '打豆豆', completed: false },
]

export const todos = localStore('lymslive-wetodo', initialTodos)
