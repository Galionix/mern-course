const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const config = require('config')
const { check, validationResult } = require("express-validator");
const router = Router();

//endpoints
//api/auth/register

router.post(
  "/register",
  [
    check("email", "Некорректный емаил").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6,
    }),
  ],
  //^массив мидлвэйров для валидации
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            errors: errors.array(),
            message: "Некорректные данные при регистрации",
          });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email: email });
      //ждём пока модель пользователя будет искать человека по имаилу User.findOne({email })
      if (candidate) {
        return res.status(400).json({ message: "Такой пользователь уже есть" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      //когда данный промис будет завершен мы можем

      res.status(201).json({ message: "Пользователь создан." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте снова" });
    }
  }
);

// api/auth/login
router.post("/login", 
[

    check('email', 'Введите корректный емаил').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
],
async (req, res) => {

    try {
        const errors = validationResult(req);
  
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({
              errors: errors.array(),
              message: "Некорректные данные при входе",
            });
        }

        const {email, password} = req.body

        const user = await User.findOne({email})
  
        if (!user) return res.status(400).json({message: 'Пользователь не найден'})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(400).json({message: 'Неверный парольб попробуйте снова!'})

const token = jwt.sign(
    {userId: user.id},
    {config.get('jwtSecret')},
    {expiresIn: '1h'}
)
//по умолчанию статус ответа 200, поэтому тут можно не указывать
res.json({ token, userId: user.id})


      } catch (error) {
        res
          .status(500)
          .json({ message: "Что-то пошло не так, попробуйте снова" });
      }


});

module.exports = router;
