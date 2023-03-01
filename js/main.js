let eventBus = new Vue()

Vue.component('Cards', {
    template: `
       <div class="Cards">
       <h1>Заметки</h1>
       <form class="form_create" @submit.prevent="addDetails">
           <label for="name">Добавить заметку:</label>
           <input id="task" v-model="name"  placeholder="task">
           <input type="submit" value="Добавить"> 
       </form>
           <div class="cards_inner">
                <div>
                    <p>Стобец 1</p>
                    <columns :columnFirst="columnFirst"></columns>
                </div>
                <div>
                    <p>Стобец 2</p>
                </div>
                <div>
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
    methods: {
        addDetails(){
            this.columnFirst.push(name)
        }
    },
})
Vue.component('Columns', {
    template: `
       <div class="Column">
            <p v-for="column in columnFirst">{{column}}</p>
       </div>`,

    props: {
        columnFirst:{
            type: Array,
            required: false

        }
    },

})


let app = new Vue({
    el: '#app',
    data: {

    },
})
