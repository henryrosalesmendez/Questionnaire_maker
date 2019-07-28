 
//Create a new button and method to decrement the value of `cart`.
environment = function(){
    
    //var eventBus = new Vue()
    Vue.component('QuestionnaireItems', {
        props:["item", "ind", "radioinputs"],
        template: 
        `
        <div :class="divWholeItemClasses" @click="selectingByClick()" @mouseover="highlightItem()" @mouseleave="mouseLeaveItem()">
            <div :class="divClasses">
                <div>
                    <input v-if="radioinputs" type="radio" :checked="item.selectedByUser" :disabled="state_revision_item" name="foo" @click="selecting_radio()">
                    
                    <input v-if="!radioinputs" type="checkbox" v-model="item.selectedByUser" value=false :disabled="state_revision_item" name="foo" @click="selecting_check()">
                    
                    &nbsp;{{item.caption}}<br>
                </div>  
            </div>
            <div v-if="somethingToSay()" class="footer_item" :show="false">
                {{item.toSay}}
            </div>
        </div>
        `,
        
        data(){
            return {
                state_revision_item: false,
                mouseoveritem: false,
                //radioSeleted: -1,
                //ischecked: false,
            }
        },
        
        methods:{
            somethingToSay(){
                return (this.item.toSay != "") && (this.state_revision_item==true);
            },
            
            selecting_radio(){
                this.$emit('on-click-radio',this.ind);
            },
            
            selecting_check(){
                //nothing to do by now
            },
            
            
            /*changingSelection(){
                this.item.selectedByUser = !this.item.selectedByUser;
            },*/
            
            highlightItem(){
                this.mouseoveritem = true;
            },
            
            mouseLeaveItem(){
                this.mouseoveritem = false;
            },
            
            
            selectingByClick(){
                if (this.radioinputs){
                    //radioSeleted = this.ind;
                    this.$emit('on-click-radio',this.ind);
                }
                else{
                    this.item.selectedByUser = !this.item.selectedByUser;
                }
            }
        },
        
        computed:{
            divClasses(){
                return {
                    prettyprint : true,
                    blue_color : (this.mouseoveritem && !this.state_revision_item )? true: false,
                    green_color : ((!this.mouseoveritem || this.state_revision_item ) && this.state_revision_item && this.good_answer)  ? true : false,
                    red_color : ((!this.mouseoveritem || this.state_revision_item ) && this.state_revision_item && !this.good_answer)  ? true : false,
                }
            },
            
            getVal(){
                return this.item.selectedByUser;
            },
            
            divWholeItemClasses(){
                return {
                    div_item: true
                }
            },
            
            
            good_answer(){
                return this.item.selectedByUser === this.item.shoudBeSelected;
            },
        }
    });
    
    
    
    
    
    
    //------------------------------------------------
    Vue.component('Questionnaire', {
        props: ["myid","items","description","ttal"],
        template: `        
            <div class = "parent_show drop-shadow_ligth">
                <p class="heading">({{myid + 1}}/{{ttal}}) <span v-html="description"></span> <i>({{number_of_item_shoud_be_select}} Responses)</i></p>
                <hr>
                <div>
                    <ul>
                        <li v-for="(item, index) in items">
                            <QuestionnaireItems 
                                :item="item" 
                                ref="its" 
                                :radioinputs="onlyOneResult" 
                                @on-click-radio="getClickRadio"
                                :ind="index">
                            </QuestionnaireItems>
                        </li>
                    </ul>
                </div>
            </div>  
        `,
        
        
        data(){             
            return {
                state_revision: false,
                all_correct: false,
                number_of_item_shoud_be_select:-1,
            }
            
        },
        
        methods:{            
            
            isCorrect(index_item){
                return this.items[index_item].selectedByUser == this.items[index_item].shoudBeSelected;
                //console.log("----> ======================");
            } ,
            
            
            isCorrect_and_revision(index_item){
                return this.isCorrect(index_item) && state_revision;
            },
            
            
            setStateRevisionsToCHild(){
                this.$refs.its.forEach(it => {
                    it.state_revision_item = true;
                })
            },
            
            isCorrectedAll(){
                console.log("----> ======================");
                for (_i in this.items){
                    console.log("----> _i:"+_i);
                    
                    if (!this.isCorrect(_i)){
                        return false;
                    }
                }
                return true;
            },
            
            
            getClickRadio(index){
                console.log(["index->",index]);
                console.log(this.description)
                
                for (it_i in this.items){
                    it = this.items[it_i];
                    it.selectedByUser = (parseInt(it_i) === index)? true : false;
                }
                console.log(["questionario->",this.items[index].selectedByUser]);
            }
            
            
            
        },
        
        computed: {
            onlyOneResult(){
                if (this.number_of_item_shoud_be_select===-1){
                    this.items.forEach(it => {
                        if (it.shoudBeSelected){
                            this.number_of_item_shoud_be_select +=1;
                        }
                    })
                    
                    this.number_of_item_shoud_be_select +=1;
                }
                
                return this.number_of_item_shoud_be_select==1;
            },
            
            
            cState_revision(){
                return this.state_revision;
            }
        },
        
        mounted() {
            
        }
        
        
    });
    
    
    var app = new Vue({
        el: '#app',
        
        data:{
            current_index: 0, // -1 indicate show all
            skip_index: 0,
            finalized: false,
            list_questions: [                
                
                              
                { 
                    description:"How <b>often</b> do you play <i>tennis</i>?",
                    items: [
                        {
                            caption: "On Tuesday.",
                            shoudBeSelected: false,
                            toSay: "",
                            selectedByUser: false
                        },
                        {  
                            caption: "For two hours.",
                            shoudBeSelected: true,
                            toSay: "",
                            selectedByUser: false
                        },
                        {
                            caption: "Almost every day.",
                            shoudBeSelected: false,
                            toSay: "They are asking for frequency!",
                            selectedByUser: false
                        },
                        {
                            caption: "With John.",
                            shoudBeSelected: false,
                            toSay: "",
                            selectedByUser: false
                        },
                    ]                
                    
                },
                
                
                { 
                    description:"Why scenario are better addressed by BigTable in Google Cloud Platform? (Select two answers)",
                    items: [
                        {
                            caption: "low latency",
                            shoudBeSelected: true,
                            toSay: "",
                            selectedByUser: false
                        },
                        {  
                            caption: "structured data",
                            shoudBeSelected: false,
                            toSay: "",
                            selectedByUser: false
                        },
                        {
                            caption: "credit card transactions",
                            shoudBeSelected: true,
                            toSay: "",
                            selectedByUser: false
                        },
                        {
                            caption: "ANSI SQL queries",
                            shoudBeSelected: false,
                            toSay: "",
                            selectedByUser: false
                        },
                    ]                
                    
                },
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                

                
                
               
                
            ] // end of list
        },
        
        methods:{
            bnt_see_answer(){     
                console.log("here");
                if (this.current_index == -1){
                    this.$refs.questionnaire.forEach(qt => {
                        qt.state_revision = true;
                        qt.setStateRevisionsToCHild();
                    });
                }
                else{
                    console.log("better");
                    this.$refs.questionnaire[this.current_index].state_revision = true;
                    this.$refs.questionnaire[this.current_index].setStateRevisionsToCHild();
                }
            },
            
            btn_next(){
                this.current_index +=1;
            },
            
            btn_skip(){
                var value = parseInt(this.skip_index) - 1;
                this.current_index =value;
            },
            
            btn_previous(){
                this.current_index -=1;
            },
            
            btn_end(){
                
                // set revision flag
                for (i in this.list_questions){
                    if (parseInt(i)>this.current_index){
                        break;
                    }
                    
                    //qst = this.list_questions[i];                    
                    this.$refs.questionnaire[i].state_revision = true;
                    this.$refs.questionnaire[i].setStateRevisionsToCHild();
                }
                
                this.finalized = true;
                this.current_index = -1;
                
                /*
                // showing in console
                for (i in this.list_questions){
                    qst = this.$refs.questionnaire[i];
                    console.log("==============================================");
                    console.log(qst.description)
                    
                    for (j in qst.$refs.its){
                        var it = qst.$refs.its[j];
                        console.log([it.item.caption,it.item.selectedByUser])
                    }
                }*/
                
                
            },
            
            showDiv(index){
                return (this.current_index===-1) || (this.current_index!=-1 && this.current_index===index)? true: false
            },       
            
            corrected_responses(){
                var num = 0;
                for (i in this.list_questions){
                    qst = this.list_questions[i];
                    
                    console.log("---------------------------------------------------");
                    console.log(this.$refs.questionnaire[i].description);
                    var sr = this.$refs.questionnaire[i].state_revision;
                    var cl = this.$refs.questionnaire[i].isCorrectedAll();
                    
                    console.log(["sr:",sr]);
                    console.log(["cl:",cl]);
                    
                    if (sr && cl){
                        num += 1;
                    }
                }
                return num;
            },
            
            total_responses(){
                var num = 0;
                for (i in this.list_questions){
                    qst = this.list_questions[i];
                    
                    var sr = this.$refs.questionnaire[i].state_revision;
                    
                    if (sr){
                        num += 1;
                    }
                }
                return num;
            },
            
        },
        
        
        computed:{
            
            last_element(){
                return (this.current_index===-1) ||(this.current_index === this.list_questions.length-1) ? true: false;
            },
            
            classNextBtn(){
                return {
                    btn: true,
                    'btn-primary': !this.last_element
                }
            },
            
            first_element(){
                return (this.current_index===-1) ||(this.current_index === 0) ? true: false;
            },
            
            classPreviousBtn(){
                return {
                    btn: true,
                    'btn-primary': !this.first_element
                }
            },
            
            
        }
        
        
    });

};
