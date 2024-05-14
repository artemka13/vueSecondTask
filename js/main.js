let eventBus = new Vue()
Vue.component('Cards', {
    template: `
       <div class="Cards">
       <h1>Заметки</h1>
       <create_card></create_card>
       <p class="error" v-for="error in errors">{{ error }}</p>
           <div class="cards_inner">
                <div class="cards_item">
                    <h2>Первый столбец</h2>
                    <columns1 :columnFirst="columnFirst"></columns1>
                </div>
                <div class="cards_item">
                    <h2>Второй столбец</h2>
                    <columns2 :columnSecond="columnSecond"></columns2>
                </div>
                <div class="cards_item">
                    <h2>Третий столбец</h2>
                    <columns3 :columnThird="columnThird"></columns3>
                </div>
           </div>
       </div>`,
    data() {
        return {
            columnFirst:[],
            columnSecond:[],
            columnThird:[],
            errors: []
        }
    },
    mounted() {
        this.loadLocal()
        eventBus.$on('card-submitted', card => {
            this.errors = []
            if(this.columnFirst.length < 3){
                this.columnFirst.push(card)
            }else {
                this.errors.push('В первой колонке нельзя добавить больше 3-х карточек.')
            }
            this.saveLocal()
        })
        eventBus.$on('addColumnSecond', card => {
            this.errors = []
            if(this.columnSecond.length < 5){
                this.columnSecond.push(card)
                this.columnFirst.splice(this.columnFirst.indexOf(card), 1)
            }else if (this.columnSecond.length === 5) {
                this.errors.push('Во второй колонке не должно быть больше 5-и карточек')
                if(this.columnFirst.length > 0) {
                    this.columnFirst.forEach(item => {
                        item.arrTask.forEach(item => {
                            item.completed = true;
                        })
                    })
                }
            }
            this.saveLocal()
        })
        eventBus.$on('addColumnThird', card =>{
            this.columnThird.push(card)
            this.columnSecond.splice(this.columnSecond.indexOf(card), 1)

            if(this.columnSecond.length < 5) {
                if(this.columnFirst.length > 0) {
                    this.columnFirst.forEach(item => {
                        item.arrTask.forEach(item => {
                            item.completed = false;
                        })
                    })
                }
            }
            this.saveLocal()
        })
        eventBus.$on('addColumnOneThird', card =>{

            if (this.columnSecond.length >= 5) {
                this.errors.push("Вы не можете редактировать первую колонку, пока во второй есть 5 карточек")
            } else {
                this.columnThird.push(card)
                this.columnFirst.splice(this.columnFirst.indexOf(card), 1)
            }
            this.saveLocal()
        })

    },
    methods: {
        saveLocal() {
            localStorage.setItem('cards', JSON.stringify({
                columnFirst: this.columnFirst,
                columnSecond: this.columnSecond,
                columnThird: this.columnThird,
            }))
        },
        loadLocal() {
            const data = JSON.parse(localStorage.getItem('cards'))
            if (data) {
                this.columnFirst = data.columnFirst
                this.columnSecond = data.columnSecond
                this.columnThird = data.columnThird
            }
        },
    },

})

Vue.component('Columns1', {
    template: `
       <div class="Column">
            <div class="column_div" v-for="column in columnFirst"><h2>{{column.name}}</h2>
                <span>
                    <li v-for="task in column.arrTask" v-if="task.title != null" >
                            <strong>{{task.id}}</strong>
                            <input type="checkbox" 
                            v-model="task.completed"
                            task.completed = "true" 
                            :disabled="task.completed" 
                            v-on:change="column.status += 1"
                            @change.prevent="updateColumn(column)"
                            
                            >
                            <span :class="{done: task.completed}" >{{task.title}}</span>
                    </li>
                </span>
            </div>
       </div>`,

    props: {
        columnFirst:{
            type: Array,

        },
        columnSecond:{
            type: Array,

        },
        errors: {
            type: Array,
        },
        saveLocal: {
            type: Function
        }
    },
    methods: {
        updateColumn(card) {
            let cardTask = 0
            for(let i = 0; i < 6; i++){
                if (card.arrTask[i] != null) {
                    cardTask++
                }
            }
            if (((card.status / cardTask) * 100 >= 50) && (card.status / cardTask) * 100 != 100) {
                eventBus.$emit('addColumnSecond', card)
            }
            if ((card.status / cardTask) * 100 === 100) {
                card.data = new Date().toLocaleString()
                eventBus.$emit('addColumnOneThird', card)
            }
        },
    },

})

Vue.component('Columns2', {
    template: `
       <div class="Column">
            <div class="column_div" v-for="column in columnSecond"><h2>{{column.name}}</h2>
                <span>
                    <li v-for="task in column.arrTask" v-if="task.title != null" >
                            <strong>{{task.id}}</strong>
                            <input name="check2" type="checkbox" 
                            v-model="task.completed"
                            task.completed = "true" 
                            :disabled="task.completed" 
                            v-on:change="column.status += 1"
                            @change.prevent="updateColumnTwo(column)"
                            >
                            <span :class="{done: task.completed}" >{{task.title}}</span>
                    </li>
                </span>
            </div>
       </div>`,
    props: {
        columnSecond:{
            type: Array,

        },
        saveLocal: {
            type: Function
        }
    },
    methods: {
        updateColumnTwo(card) {
            let cardTask = 0
            for(let i = 0; i < 6; i++){
                if (card.arrTask[i] != null) {
                    cardTask++
                }
            }
            if ((card.status / cardTask) * 100 === 100) {
                card.data = new Date().toLocaleString()
                eventBus.$emit('addColumnThird', card)
            }
        },
    },

})

Vue.component('Columns3', {
    template: `
       <div class="Column">
            <div class="column_div" v-for="column in columnThird"><h2>{{column.name}}</h2>
                <span>
                    <li v-for="task in column.arrTask" v-if="task.title != null" >
                            <strong>{{task.id}}</strong>
                            <input name="check3" type="checkbox" 
                            v-model="task.completed"
                            :disabled="task.completed" 
                            >
                            <span :class="{done: task.completed}" >{{task.title}}</span>
                    </li>
                    <p>Дата окончания: <br>{{column.data}}</p>
                    
                </span>
            </div>
       </div>`,
    props: {
        columnThird:{
            type: Array,

        },
        saveLocal: {
            type: Function
        }
    },
})

Vue.component('modalWindow', {
    template: `
    <section>
    <div class="bu">
      <a href="#openModal" class="btn btnModal">Создать карточку</a>
    </div>
    <div id="openModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Создание карточки</h3>
            <a href="#close" title="Close" class="close">×</a>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createCard">
              <div class="form_create">
                <label for="task">Напишите название:</label>
                <input required class="form_input" id="task" v-model="name" placeholder="Введите название"/>
                <div class="form_div" v-for="(task, index) in tasks" :key="index">
                  <label :for="'task' + index">Добавить задачу №{{ index + 1 }}:</label>
                  <input required class="form_input" :id="'task' + index" v-model="tasks[index]" :placeholder="'Введите задачу'"/>
                  <button v-if="index > 2" @click="removeTask(index)">Удалить</button>
                </div>
                <button @click="addTask" class="form_submit">Добавить еще поле</button>
                <button type="submit" class="form_submit">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
    data() {
        return {
            name: null,
            tasks: ['','',''],
            errors: [],
        }
    },
    methods: {
        createCard() {
            let card = {
                name: this.name,
                arrTask: this.tasks.map((task, index) => ({ id: index + 1, title: task, completed: false })),
                data: null,
                status: 0,
                errors: []
            }
            eventBus.$emit('card-submitted', card);
            this.name = null;
            this.tasks = ['','','']; // Reset the tasks array after submission
        },
        addTask() {
            if (this.tasks.length < 6) {
                this.tasks.push('');
            }
        },
        removeTask(index) {
            if (this.tasks.length > 3) {
                this.tasks.splice(index, 1);
            }
        }
    },
    props: {
        columnFirst: {
            type: Array,
            required: false,
        },
    },
});

Vue.component('create_card', {
    template: `
<section id="main" class="main-alt">
<div class="form__control">
<modalWindow/>
</div>
</section>
`,
})

let app = new Vue({
    el: '#app',
    data: {
    },

})