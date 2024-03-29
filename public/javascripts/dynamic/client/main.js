
Vue.component("collapse",(resolve,reject)=>{
    $.get('/factory/vue/collapse',(data,textStatus,jqXHR)=>{
        resolve({
            template:data,
            props:{
                tipo:String,
                item:Object,
                precos:Object
            },
            data:function(){
                return {
                    outroPreco:0.00
                }

            },
            computed:{},
            methods:{
                async alugar(el){
                    let price=el.target.attributes.price.value
                    let duracao=el.target.attributes.duracao.value
                    var dialog=confirm("Quer alugar a barraca "+this.item.number+" por "+price+"€?")
                    if (dialog == true) {
                        let result = await $.post("/alugar/barraca/" + this.item.id, {price,nome:duracao})

                        this.$el.classList.remove("show")
                        this.item.rented=true
                        this.item.rentId=result.id
                        let now=this.nowDate();
                        //TODO Set duration
                        //now only has the granularity of a day
                        this.item.duration=duracao
                        this.item.startDate=now
                        this.item.endDate=now

                    }
                },
                reservar(){
                    let now=this.nowDate();
                    let collapse=this.$el


                    $('.modal#reserveTent .date#startDate').val(now)
                    $('.modal#reserveTent .date#endDate').val(now)
                    $('.modal#reserveTent input.id').val(this.item.id)
                    $('.modal#reserveTent').modal('show');
                    let that=this

                    $('.modal#reserveTent button.reservar').click(function(){
                        var name=$('.modal#reserveTent input#name').val()
                        var startDate=$('.modal#reserveTent .date#startDate').val()
                        var endDate=$('.modal#reserveTent .date#endDate').val()
                        var price=$('.modal#reserveTent input#price').val()
                        var pago=$('.modal#reserveTent input#pago').val()

                        $.get("/reservar/barraca/"+that.item.id+"?name="+name+"&startDate="+startDate+"&endDate="+endDate+"&price="+encodeURI(price)+"&pago="+pago, function(data){
                                $('.modal#reserveTent').modal('hide');
                                collapse.classList.remove('show')
                                that.item.reserved=true
                                that.item.rentId=data.id
                                that.item.startDate=startDate
                                that.item.endDate=endDate
                            }
                        )
                    })
                },
                nowDate(){
                    let d=new Date();
                    let yyyy=d.getFullYear()
                    let mm=this.pad(d.getMonth()+1,2)
                    let dd=this.pad(d.getDate(),2)
                    return yyyy+"-"+mm+"-"+dd
                },
                pad(num, size) {
                    var s = num+"";
                    while (s.length < size) s = "0" + s;
                    return s;
                }
            }
        })
    })
})
Vue.component("fila",(resolve,reject)=> {
    $.get('/factory/vue/fila', (data, textStatus, jqXHR) => {
        resolve({
            template:data,
            props:{
                fila:Array,
                mini:Boolean,
                excludeType:String,
                orientacao:String,
                selected:String,
            },
            data:function(){
                return {}
            },
            computed:{},
            methods:{}
        })
    })
})
window.app=new Vue({
    el:"#app",
    data:{
        previous:-1,
        next:-1,
        subTipos:[],
        duracoes:[],
        precos:{},
        barracas:[],
        chapeus:[],
        barracaChapeu:[{}],
        tipo:"",
        tipoPresentation:"",
        numero:null,
        numFila:"",
        orientacao:"",
        orientation:this.orientacao,
        barracasFrontais:{},
        itemInfo:{},
        valorReserva:undefined,
    },
    computed:{

    },
    methods:{
        goto(num){
            location.pathname=`/client/rent/${this.tipo}/${num}`
        },
        async alugar(el){
            let price=el.target.attributes.price.value
            let duracao=el.target.attributes.duracao.value
            var dialog=confirm("Quer alugar a barraca "+this.itemInfo.number+" por "+price+"€?")
            if (dialog == true) {
                //TODO intermediate screen
                let result = await $.post("/alugar/barraca/" + this.item.id, {price,nome:duracao})

                this.$el.classList.remove("show")
                this.itemInfo.rented=true
                this.itemInfo.rentId=result.id
                let now=this.nowDate();
                //TODO Set duration
                //now only has the granularity of a day
                this.itemInfo.duration=duracao
                this.itemInfo.startDate=now
                this.itemInfo.endDate=now

            }
        },
        reservar(){
            let now=this.nowDate();
            let collapse=this.$el


            $('.modal#reserveTent .date#startDate').val(now)
            $('.modal#reserveTent .date#endDate').val(now)
            $('.modal#reserveTent input.id').val(this.itemInfo.id)
            $('.modal#reserveTent').modal('show');
            let that=this

            $('.modal#reserveTent button.reservar').click(function(){
                var name=$('.modal#reserveTent input#name').val()
                var startDate=$('.modal#reserveTent .date#startDate').val()
                var endDate=$('.modal#reserveTent .date#endDate').val()
                var price=$('.modal#reserveTent input#price').val()
                var pago=$('.modal#reserveTent input#pago').val()

                $.get("/reservar/barraca/"+that.item.id+"?name="+name+"&startDate="+startDate+"&endDate="+endDate+"&price="+encodeURI(price)+"&pago="+pago, function(data){
                        $('.modal#reserveTent').modal('hide');
                        collapse.classList.remove('show')
                        that.item.reserved=true
                        that.item.rentId=data.id
                        that.item.startDate=startDate
                        that.item.endDate=endDate
                    }
                )
            })
        },
        nowDate(){
            let d=new Date();
            let yyyy=d.getFullYear()
            let mm=this.pad(d.getMonth()+1,2)
            let dd=this.pad(d.getDate(),2)
            return yyyy+"-"+mm+"-"+dd
        },
        pad(num, size) {
            var s = num+"";
            while (s.length < size) s = "0" + s;
            return s;
        }
    },
    async beforeMount(){
        try {
            this.tipo = location.pathname.split("/")[3]
            this.tipoPresentation = _.capitalize(_.trimEnd(this.tipo, 's'))
            this.numero = location.pathname.split("/")[4]
            this.itemInfo = await $.get(`/api/v1/get-row/${this.tipoPresentation}/${this.numero}`)
            //TODO is this public?
            this.barracaChapeu = await $.get(`/api/v1/fila/${this.tipo}/${parseInt(this.itemInfo.localizacao.split(" ")[1])}`)
            //Append transaction state
            Object.assign(this.itemInfo,this.barracaChapeu.find(item=>this.itemInfo.id==item.id))

            this.subTipos = await $.get("/api/v1/list/subTypes")
            this.duracoes = await $.get("/api/v1/list/durations")
            this.precos = await $.get("/api/v1/list/prices")


            //Shift rows
            this.barracas = await $.get("/api/v1/list/rows/Barraca")
            this.chapeus = await $.get("/api/v1/list/rows/Chapeu")
            //Previous
            if (this.numFila == 1) {
                this.previous = -1
            } else {
                this.previous = parseInt(this.numFila) - 1
            }
            //Next
            let numeroDaUltimaBarracaChapeu=this.barracaChapeu[this.barracaChapeu.length-1].number
            if (this.numFila >= this[this.tipo].length) {
                this.next = -1
            } else {
                this.next = parseInt(numeroDaUltimaBarracaChapeu) + 1
            }

            //Because on Barracas are frontais
            this.barracasFrontais.normal = this.barracaChapeu.filter(el => el.frontal == true && !el.annex)
            this.barracasFrontais.anexo = this.barracaChapeu.filter(el => el.frontal == true && el.annex)

            //Gets first match
            this.orientacao = this.barracaChapeu.find(el => ["Traseira", "Lateral"].indexOf(el.subtipo) != -1).subtipo
        }catch (e) {
            displayToast("Loading data failed",e.message)
        }
    }
})