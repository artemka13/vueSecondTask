let eventBus = new Vue()
Vue.component('Cards', {
    template: `
       <div class="Cards">
       <h1>Заметки</h1>
       <create_card></create_card>
           <div class="cards_inner">
                <div class="cards_item">
                    <h2>Первый столбец</h2>
                    <columns1 :saveLocal="saveLocal" :columnFirst="columnFirst"></columns1>
                </div>
                <div class="cards_item">
                    <h2>Второй столбец</h2>
                    <columns2 :saveLocal="saveLocal" :columnSecond="columnSecond"></columns2>
                </div>
                <div class="cards_item">
                    <h2>Третий столбец</h2>
                    <columns3 :saveLocal="saveLocal" :columnThird="columnThird"></columns3>
                </div>
           </div>
       </div>`,
    data() {
        return {
            columnFirst:[],
            columnSecond:[],
            columnThird:[],
        }
    },
    mounted() {
        eventBus.$on('card-submitted', card => {
            if(this.columnFirst.length < 3){
                this.columnFirst.push(card)
            }
        })
        eventBus.$on('addColumnSecond', card => {
            if(this.columnSecond.length < 5){
                this.columnSecond.push(card)
                this.columnFirst.splice(this.columnFirst.indexOf(card), 1)
            }
        })
        eventBus.$on('addColumnThird', card =>{
            this.columnThird.push(card)
            this.columnSecond.splice(this.columnSecond.indexOf(card), 1)
        })
        eventBus.$on('addColumnOneThird', card =>{
            this.columnThird.push(card)
            this.columnFirst.splice(this.columnFirst.indexOf(card), 1)
        })
        this.columnFirst = JSON.parse(localStorage.getItem("columnFirst"))
        this.columnSecond = JSON.parse(localStorage.getItem("columnSecond"))
        this.columnThird = JSON.parse(localStorage.getItem("columnThird"))
    },
    methods: {
        saveLocal() {
            localStorage.setItem('columnFirst', JSON.stringify(this.columnFirst))
            localStorage.setItem('columnSecond', JSON.stringify(this.columnSecond))
            localStorage.setItem('columnThird', JSON.stringify(this.columnThird))
        }
    }
})

Vue.component('Columns1', {
    template: `
       <div class="Column">
            <div class="column_div" v-for="column in columnFirst"><h2>{{column.name}}</h2>
                <span>
                    <li v-for="task in column.arrTask" v-if="task.title != null" >
                            <strong>{{task.id}}</strong>
                            <input type="checkbox" 
                            task.completed = "true" 
                            :disabled="task.completed" 
                            v-on:change="column.status += 1"
                            @change.prevent="updateColumn(column)">
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
        saveLocal: {
            type: Function
        }

    },
    methods: {
        updateColumn(card) {
            let cardTask = 0
            for(let i = 0; i < 5; i++){
                if (card.arrTask[i].title != null) {
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
            this.saveLocal()
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
                            <input type="checkbox" 
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
            for(let i = 0; i < 5; i++){
                if (card.arrTask[i].title != null) {
                    cardTask++
                }
            }
            if ((card.status / cardTask) * 100 === 100) {
                card.data = new Date().toLocaleString()
                eventBus.$emit('addColumnThird', card)
            }
            this.saveLocal()
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
                            <input type="checkbox" 
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
                    <label for="name">Напишите название:</label>
                    <input class="form_input" id="task" v-model="name" placeholder="Введите название"/>

                    <div class="numberOne">
                      <label for="name">Добавить задачу №1:</label>
                      <input class="form_input" id="task1" v-model="name1" placeholder="Введите задачу"/>
                    </div>
                    <div class="form_div">
                      <label for="name">Добавить задачу №2:</label>
                      <input class="form_input" id="task2" v-model="name2" placeholder="Введите задачу"/>
                    </div>
                    <div class="form_div">
                      <label for="name">Добавить задачу №3:</label>
                      <input class="form_input" id="task3" v-model="name3" placeholder="Введите задачу"/>
                    </div>
                    <div class="form_div">
                      <label for="name">Добавить задачу №4:</label>
                      <input class="form_input" id="task4" v-model="name4" placeholder="Введите задачу">
                    </div>
                    <div class="form_div">
                      <label for="name">Добавить задачу №5:</label>
                      <input class="form_input" id="task5" v-model="name5" placeholder="Введите задачу">
                    </div>
                    <button class="form_submit" @click="persist">Добавить</button>
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
            name1:null,
            name2:null,
            name3:null,
            name4:null,
            name5:null,


        }
    },
        methods: {
            createCard() {
                let card = {
                    name: this.name,
                    arrTask: [ {id: 1, title: this.name1, completed: false},
                        {id: 2, title: this.name2, completed: false},
                        {id: 3, title: this.name3, completed: false},
                        {id: 4, title: this.name4, completed: false},
                        {id: 5, title: this.name5, completed: false},
                    ],
                    data: null,
                    status: 0
                }
                eventBus.$emit('card-submitted', card)
                    this.name = null
                    this.arrTask = null
                    this.name1 = null
                    this.name2 = null
                    this.name3 = null
                    this.name4 = null
                    this.name5 = null
            },
            persist() {
                localStorage.name = this.name;
                localStorage.name1 = this.name1;
                localStorage.name2 = this.name2;
                localStorage.name3 = this.name3;
                localStorage.name4 = this.name4;
                localStorage.name5 = this.name5;
            }

    },
    mounted() {
        if(localStorage.name) this.name = localStorage.name;
        if(localStorage.name1) this.name1 = localStorage.name1;
        if(localStorage.name2) this.name2 = localStorage.name2;
        if(localStorage.name3) this.name3 = localStorage.name3;
        if(localStorage.name4) this.name4 = localStorage.name4;
        if(localStorage.name5) this.name5 = localStorage.name5;
    },

    props: {
        columnFirst:{
            type: Array,
            required: false,
        },
        saveLocal: {
            type: Function
        }
    },
})

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