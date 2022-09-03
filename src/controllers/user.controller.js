const UserModel = require('../models/user.model');
const authService = require('../services/auth.service');
const Joi = require('joi');
const config = require('../config');
const cachegoose = require('recachegoose');

exports.generateToken = async (req, res) => {
    try {
        const token = await authService.generateAuthTokens();
        res.status(200).json({token})
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.getAll = async (req, res) => {
    try {
        let foundUser = await UserModel.find().cache(config.redisCacheLifeTime, 'userAll');
        
        if(!foundUser || foundUser.length == 0) {
            res.status(404).json({message: "User not found!"});
        } else {
            res.status(200).json(foundUser);
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.create = async (req, res) => {
    const {userName, emailAddress, accountNumber, identityNumber} = req.body;
    try {
        let userSchema = Joi.object().keys({
            userName: Joi.string().required().max(50).min(5),
            accountNumber: Joi.number().required(),
            identityNumber: Joi.number().required(),
            emailAddress: Joi.string().required().min(5).max(100)
        });
        const result = userSchema.prefs({ errors: { label: 'key' } }).validate(req.body)
        const { value, error } = result;
        if (error != null) {
            res.status(422).json({
                message: 'invalid request',
                error: error,
                data: value
            });
        }

        const foundUser = await UserModel.find({userName});

        if(!foundUser || foundUser.length == 0) {
            const user = new UserModel(value);
            const response = await user.save();
            
            cachegoose.clearCache('userAll');

            res.status(201).json(response);
        } else {
            res.status(409).json({message: "User already exists!"});
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.read = async (req, res) => {
    const {id} = req.params;
    try {
        const foundUser = await UserModel.findOne({_id: id}).cache(config.redisCacheLifeTime, id);

        if(!foundUser || foundUser.length == 0) {
            res.status(404).json({message: "User not found!"});
        } else {
            res.status(200).json(foundUser);
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.getByAccountNumber = async (req, res) => {
    const {id} = req.params;
    try {
        const foundUser = await UserModel.find({accountNumber: id}).cache(config.redisCacheLifeTime, id);

        if(!foundUser || foundUser.length == 0) {
            res.status(404).json({message: "User not found!"});
        } else {
            res.status(200).json(foundUser);
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.getByIdentityNumber = async (req, res) => {
    const {id} = req.params;
    try {
        const foundUser = await UserModel.find({identityNumber: id}).cache(config.redisCacheLifeTime, id);

        if(!foundUser || foundUser.length == 0) {
            res.status(404).json({message: "User not found!"});
        } else {
            res.status(200).json(foundUser);
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { userName, emailAddress, accountNumber, identityNumber } = req.body;
    
    try {
        const foundUser = await UserModel.findOne({ _id: id });

        let userSchema = Joi.object().keys({
            userName: Joi.string().required().max(50).min(5),
            accountNumber: Joi.number().required(),
            identityNumber: Joi.number().required(),
            emailAddress: Joi.string().required().min(5).max(100)
        });
        const result = userSchema.prefs({ errors: { label: 'key' } }).validate(req.body)
        const { value, error } = result;
        if (error != null) {
            res.status(422).json({
                message: 'invalid request',
                error: error,
                data: value
            });
        }
    
        if (foundUser || foundUser.length == 0) {
            let oldUser = {};
            Object.assign(oldUser, foundUser);
            Object.assign(foundUser, value);
            await foundUser.save();

            cachegoose.clearCache('userAll');
            cachegoose.clearCache(foundUser._id);
            cachegoose.clearCache(oldUser.identityNumber);
            cachegoose.clearCache(oldUser.accountNumber);

            res.status(200).json(foundUser);
        } else {
            res.status(404).json({message: `User not found...`});
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
    
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const foundUser = await UserModel.findOne({ _id: id });
    
        if(foundUser || foundUser.length == 0) {
            const response = await foundUser.deleteOne({_id: id});
            res.status(202).json(response);
        } else {
            res.status(404).json({message: `User not found...`});
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}
