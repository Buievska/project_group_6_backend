import { Segments, Joi } from "celebrate";


export const loginUserSchema = {
    [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),

    }),
};

