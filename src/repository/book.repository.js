const Error = require('../utils/handlerError');

module.exports = (modelManager) => { // CustomerRepository()

    const { book, Op } = modelManager;
    const create = async (payload) => {
        try {
            const addRes = await book.create(payload);
        if (addRes.dataValues) {
            return addRes.dataValues;
        }else{
            throw Error(400, 'Failed to create book');
        }
        } catch (err) {
            const message = err.original.detail || err.message;
            throw Error(err.statusCode, message);
        }
    }

    const list = async (keyword = '', page, size, sortBy = 'created_at', sortType = 'desc') => {
        try {
            const offset = size * (page - 1);
            const { count, rows } = await book.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${keyword}%` } },
                        { author: { [Op.iLike]: `%${keyword}%` } },
                        // { category_id: { [Op.iLike]: `%${keyword}%` } },
                        { isbn: { [Op.iLike]: `%${keyword}%` } },
                    ]
                },
                offset: offset,
                limit: size,
                order: [
                    [sortBy, sortType]
                ],
            })
            if (count > 0) {
                return { count, rows };
            }else{
                throw Error(404, 'Books not found');
            }
        } catch (err) {
            throw Error(err.statusCode, err.message);
        }
    }

    const getById = async (id) => {
        try {
           
            const res = await book.findByPk(id);
            if (res){
                 return res
                }else{
                    throw Error(404, `Book with id ${id} not found`);
                };
        } catch (err) {
            throw Error(err.statusCode, err.message);
        }
    }

    const remove = async (id) => {
        try {
            // const res = await book.findByPk(id);
            // if (!res) return `book with value ID ${id} not found!`;
         const res = await book.destroy({ where: { id: id } });
         
          if (res === 0){
            throw Error(404, `Book with id ${id} not found`);
          }else{
            return `book with value ID ${id} has been deleted!`;
          }
        } catch (err) {
            throw Error(err.statusCode, err.message);
        }
    }

    const update = async (payload) => {
        try {
         const updateBook = await book.update(payload, {
                where: { id: payload.id }
            });

            console.log(updateBook);
            if(updateBook[0] === 0){
                throw Error(404, `Book with id ${payload.id} not found`);
            }else{
                return `book with value ID ${payload.id} has been updated!`;
            }
        } catch (err) {
            const message = err.original.detail || err.message;
            throw Error(err.statusCode, message);
        }
    }

    return {
        create, list, getById, remove, update
    }
}
