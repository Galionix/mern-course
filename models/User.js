const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
    email:{type: String, required: true, unique: true},
    password: {type:String, required: true},
    links: [{type: Types.ObjectId, ref: 'Link'}]
    //массив, модель. тип - Types.ObjectId. Это связка модели пользователя и определённых данных в базе. Привязка к модели линк
})

module.exports = model('User', schema)
// экспортируем из файла результат работы функции model где мы даём название нашей модели и схема по которой он работает это обьект схема