
const getList = async (model, condition, attributes, limit, offset, order, transaction) => {
    try {
        let list = await model.findAndCountAll({
            ...condition !== undefined && {
                where: condition
            },
            ...attributes !== undefined && {
                attributes
            },
            ...limit !== undefined && {
                limit
            },
            ...offset !== undefined && {
                offset
            },
            ...order !== undefined && {
                order
            },
            ...transaction !== undefined && {
                transaction
            },
        });
        return list ? JSON.parse(JSON.stringify(list)) : false;

    } catch (error) {
        console.log(error);
        return false
    }
}

const joinTwoTables = async (model1, model2, condition1, condition2, attributes1, attributes2) => {
    try {
        const data = await model1.findOne({
            where: condition1,
            include: [{
                model: model2,
                ...condition2 !== undefined && { where: condition2 },
                ...attributes2 !== undefined && { attributes: attributes2 },

            }],
            ...attributes1 !== undefined && { attributes: attributes1 },
        });
        return data ? JSON.parse(JSON.stringify(data)) : false
    } catch (err) {
        console.log(err);
    }
}

const create = async (model, content, transaction) => {
    try {
        console.log(model, content, "QQQQQQQQQQQQ")
        const data = await model.create(content, { transaction });
        return data ? JSON.parse(JSON.stringify(data)) : false;
    }
    catch (error) {
        console.log("🚀 ~ file: common.js:38 ~ exports.create= ~ error:", error)
        return false;
    }
};

const bulkCreate = async (model, content, transaction) => {
    try {
        const data = await model.bulkCreate(content, { transaction });
        console.log(content);
        return data ? JSON.parse(JSON.stringify(data)) : false;
    }
    catch (error) {
        console.error('CreatetionError>>>>>>>>>', error);
        return false;
    }
};

const updateData = async (model, data, condition, transaction) => {
    try {
        console.log('condition', condition);
        const result = await model.update(data, { where: condition, transaction });
        return result ? result : false;
    } catch (error) {
        console.log('errrror>>>>>>>', error);
        return false;
    }
}

const findByCondition = async (model, condition, attributes, order) => {
    try {
        const data = await model.findOne({
            ...condition !== undefined && {
                where: condition
            },
            ...attributes !== undefined && {
                attributes
            },
            ...order !== undefined && {
                order: [order]
            }
        });
        return data ? JSON.parse(JSON.stringify(data)) : false
    } catch (error) {
        console.log('err>>>>>>>>>>>>>> in find', error);
        return false
    }
}

const deleteQuery = async (model, condition, transaction, force = false) => {
    try {
        const data = await model.destroy({
            where: condition,
            force: force,
            transaction
        });
        // model.destroy() returns the number of affected rows.
        // We return this number directly.
        return data;
    } catch (error) {
        console.error('Delete Error >>>>>>>', error);
        return false
    }
}

const count = async (model, condition) => {
    try {
        const total = await model.count({ where: condition })
        return total ? JSON.parse(JSON.stringify(total)) : 0

    } catch (error) {
        return false
    }
}




module.exports = {
    getList,
    joinTwoTables,
    create,
    bulkCreate,
    updateData,
    findByCondition,
    deleteQuery,
    count
}
