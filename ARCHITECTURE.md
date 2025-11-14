# 🏗️ Архитектура проекта (Vue 3 + Pinia)

## Новая структура каталогов

```
chat-app/
├── index.html                    # Точка входа Vite
├── vite.config.js               # Конфигурация Vite
├── package.json                 # Зависимости (Vue 3, Pinia, Vite)
├── .eslintrc.json               # ESLint конфигурация
├── .env.example                 # Пример переменных окружения
│
├── SETUP.md                     # 📖 Инструкция по запуску
├── MIGRATION.md                 # 📖 Описание миграции с Vue 2
├── CHANGES.md                   # 📖 Полный список изменений
├── README.md                    # 📖 Документация проекта
│
├── src/
│   ├── main.js                  # ⚡ Entry point (Vue 3 + Pinia)
│   ├── App.vue                  # 🎯 Root компонент
│   ├── utils.js                 # 🔧 Утилиты
│   │
│   ├── store/
│   │   └── chatStore.js         # 📦 Pinia store (вся логика)
│   │
│   ├── models/
│   │   └── Message.js           # 📋 Модель сообщения
│   │
│   ├── components/
│   │   ├── Chat.vue             # 💬 Основной компонент чата
│   │   ├── Message.vue          # 💭 Компонент отдельного сообщения
│   │   ├── YourNameComponent.vue # 👤 Ввод имени пользователя
│   │   │
│   │   └── ui/
│   │       ├── CustomInput.vue  # ⌨️ Input компонент
│   │       └── CustomButton.vue # 🔘 Button компонент
│   │
│   └── assets/
│       └── css/
│           └── main.css         # 🎨 Глобальные стили
│
└── public/
    └── favicon.ico              # 🔗 Фавиконка
```

## 🔄 Поток данных (Composition API + Pinia)

```
User Input
   ↓
Chat.vue (Component)
   ↓
store.addMessage() (Pinia Action)
   ↓
chatStore (State: messages, userInfo)
   ↓
Message.vue (Computed Properties)
   ↓
Render (Template)
   ↓
UI Update
```

## 📦 Компонент: Chat.vue

### Структура
```vue
<template>
  <!-- Display messages (reversed) -->
  <!-- Input field + Send button -->
</template>

<script setup>
  // composables
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useChatStore } from '@/store/chatStore'
  
  // state
  const store = useChatStore()
  const messageText = ref('')
  
  // methods
  const sendMessage = () => { ... }
  const trySend = (data) => { ... }
  const onErrorClick = (message) => { ... }
  
  // lifecycle
  onMounted(() => { ... })
  onUnmounted(() => { ... })
</script>
```

## 📦 Pinia Store: chatStore.js

### API
```javascript
// State
store.messages          // Array<Message>
store.userInfo          // { name, id }

// Computed
store.reversedMessages  // Reversed array
store.userInfoComputed  // User info object

// Actions
store.addMessage(text, status)      // Add message
store.deleteMessage(messageId)      // Remove message
store.setUserInfo(name, id)         // Set user
store.saveState()                   // Save to localStorage
store.loadState()                   // Load from localStorage
```

## 🎯 Жизненный цикл сообщения

### 1. Создание
```
User types + presses "Send"
  ↓
sendMessage() called
  ↓
trySend(messageText)
  ↓
setTimeout (800ms simulation)
```

### 2. Попытка отправки
```
Promise resolve (90%) or reject (10%)
  ↓
resolve: store.addMessage(data, true)   ✅ Success
reject:  store.addMessage(data, false)  ❌ Failed
```

### 3. Хранение
```
Success → saveMessageToStorage()
       → localStorage.setItem('message')
       → Синхронизирует с другими вкладками
       
Failure → Красная граница (failed status)
       → Кнопка повтора (retry button)
```

### 4. Загрузка
```
App mounts
  ↓
store.loadState()
  ↓
Читает localStorage['history']
  ↓
Восстанавливает только успешные сообщения
```

## 🔐 State Management

### Vuex (было)
```javascript
// Действие
dispatch('sendMessageSync', data)
  ↓ commits
mutations: { PUSH_MESSAGE() }
  ↓ updates
state.messages

// Получение
getters['messages']
```

### Pinia (стало)
```javascript
// Действие (прямое)
store.addMessage(data, true)
  ↓ updates
state.messages = [...messages, newMsg]

// Получение (прямое)
store.messages
store.reversedMessages
```

## 🚀 Performance улучшения

### Webpack (Vue CLI) vs Vite

| Метрика | Webpack | Vite |
|---------|---------|------|
| **Cold Start** | 3-5s | ~100ms |
| **HMR** | 1-2s | <100ms |
| **Build** | 30-60s | 2-5s |
| **Bundle Size** | 250KB+ | 120KB |

## 🔌 Composables (переиспользуемая логика)

### Возможные composables для будущего расширения:

```javascript
// useMessages.js
const useMessages = () => {
  const store = useChatStore()
  
  const sendMessage = (text) => { ... }
  const deleteMessage = (id) => { ... }
  const getMessage = (id) => { ... }
  
  return { sendMessage, deleteMessage, getMessage }
}

// useLocalStorage.js
const useLocalStorage = () => {
  const save = (key, value) => { ... }
  const load = (key) => { ... }
  const clear = (key) => { ... }
  
  return { save, load, clear }
}
```

## 📝 Модель данных

### Message.js
```javascript
class Message {
  id        // number - уникальный ID
  text      // string - текст сообщения
  userInfo  // { name, id } - информация отправителя
  status    // boolean - успешность отправки
}
```

## 🔑 Ключевые отличия

### Синтаксис Components

#### Vue 2
```vue
<script>
export default {
  data() { return { msg: '' } },
  methods: { send() {} },
  computed: { messages() {} },
  beforeDestroy() {}
}
</script>
```

#### Vue 3
```vue
<script setup>
const msg = ref('')
const send = () => {}
const messages = computed(() => {})
onUnmounted(() => {})
</script>
```

### Event Emitting

#### Vue 2
```vue
<!-- Parent -->
<Child @updateName="updateName" />

<!-- Child -->
this.$emit('updateName', name)
```

#### Vue 3
```vue
<!-- Parent -->
<Child @update-name="updateName" />

<!-- Child -->
const emit = defineEmits(['update-name'])
emit('update-name', name)
```

### v-model

#### Vue 2
```javascript
props: { value: String }
@input="$emit('input', $event.target.value)"
```

#### Vue 3
```javascript
props: { modelValue: String }
@input="emit('update:modelValue', $event.target.value)"
```

---

**Архитектура готова к масштабированию! 🎯**
