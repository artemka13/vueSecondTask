let eventBus = new Vue()
let eventBusTwo = new Vue()
Vue.component('Cards', {
    template: `
       <div class="Cards">
       <h1>Заметки</h1>
       <create_card></create_card>
           <div class="cards_inner">
                <div class="cards_item">
                    <h2>Новые</h2>
                    <columns1 :columnFirst="columnFirst"></columns1>
                </div>
                <div class="cards_item">
                    <h2>В процессе</h2>
                    <columns2 :columnSecond="columnSecond"></columns2>
                </div>
                <div class="cards_item">
                    <h2>Завершенные</h2>
                    <columns3 :columnThird="columnThird"></columns3>
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
        eventBusTwo.$on('addColumnSecond', card => {
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
            required: false

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
            required: false

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
            required: false

        }

    },
    methods: {

    }

})

Vue.component('create_card', {
    template: `
       <form>
    <div class="form_create">
         <label for="name">Добавить заметку:</label>
        <input class="form_input" id="task" v-model="name" placeholder="task">
        <hr>
         <div class="form_div">
             <label for="name">Добавить задачу:</label>
             <input class="form_input" id="task1" v-model="name1" placeholder="task">
         </div>
         <div class="form_div">
             <label for="name">Добавить задачу:</label>
             <input class="form_input" id="task2" v-model="name2" placeholder="task">
         </div>
         <div class="form_div">
             <label for="name">Добавить задачу:</label>
             <input class="form_input" id="task3" v-model="name3" placeholder="task">
         </div>
         <div class="form_div">
             <label for="name">Добавить задачу:</label>
             <input class="form_input" id="task4" v-model="name4" placeholder="task">
         </div>
         <div class="form_div">
             <label for="name">Добавить задачу:</label>
             <input class="form_input" id="task5" v-model="name5" placeholder="task">
         </div>
         <!--        <input @click="createCard" class="ford_submit" type="button" value="Добавить">-->
        <button @click="createCard" class="ford_submit" type="button" >Добавить</button>
     </div>
       </form>
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

    },
    props: {
        columnFirst:{
            type: Array,
            required: false

        },
    },
})

let app = new Vue({
    el: '#app',
    data: {
    },

})