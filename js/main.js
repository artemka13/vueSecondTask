let eventBus = new Vue()
Vue.component('Cards', {
    template: `
       <div class="Cards">
       <h1>Заметки</h1>
       <create_card></create_card>
           <div class="cards_inner">
                <div class="cards_item">
                    <p>Стобец 1</p>
                    <columns :columnFirst="columnFirst"></columns>
                </div>
                <div class="cards_item">
                    <p>Стобец 2</p>
                </div>
                <div class="cards_item">
                    <p>Стобец 3</p>
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
            if(this.columnFirst.length < 3){this.columnFirst.push(card)}

        })
    },
    methods: {

    },
})

Vue.component('create_card', {
    template: `
       <form class="form_create" @submit.prevent="createCard">
           <label for="name">Добавить заметку:</label>
           <input id="task" v-model="name" required placeholder="task">
           <p>
               <label for="name">Добавить задачу:</label>
               <input id="task1" v-model="name1" required placeholder="task">
               <label for="name">Добавить задачу:</label>
               <input id="task2" v-model="name2" required placeholder="task">
               <label for="name">Добавить задачу:</label>
               <input id="task3" v-model="name3" required placeholder="task">
               <label for="name">Добавить задачу:</label>
               <input id="task4" v-model="name4" placeholder="task">
               <label for="name">Добавить задачу:</label>
               <input id="task5" v-model="name5" placeholder="task">
               <input type="submit" value="Добавить"> 
               
           </p>
       </form>`,
    data() {
        return {
            name: null,
            arrTask: [],
            name1:null,
            name2:null,
            name3:null,
            name4:null,
            name5:null,


        }
    },
    methods:{
        createCard() {
            let card = {
                name: this.name,
                arrTask: [this.name1, this.name2, this.name3, this.name4, this.name5],
                data: null,
                status: 0

            }
            eventBus.$emit('card-submitted', card),
                this.name = null,
                this.arrTask = null,
                this.name1 = null,
                this.name2 = null,
                this.name3 = null,
                this.name4 = null,
                this.name5 = null,
                console.log(card)

        },
    },
    props: {
        columnFirst:{
            type: Array,
            required: false

        },
    },
})


Vue.component('Columns', {
    template: `
       <div class="Column">
            <p v-for="column in columnFirst">{{column.name}}</p>
       </div>`,

    props: {
        columnFirst:{
            type: Array,
            required: false

        },
        arrTask: {
            type: Array,
            required: false
        }

    },

})
let app = new Vue({
    el: '#app',
    data: {
    }
})