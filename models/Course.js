const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please add course title']
    },
    description:{
        type:String,
        required:[true,'Please add course description']
    },
    weeks:{
        type:String,
        required:[true,'Please add number of weeks']
    },
    tuition:{
        type:Number,
        required:[true,'Please add tuition cost']
    },
    minimumSkill:{
        type:String,
        required:[true,'Please add a minimun skill'],
        enum:['beginner','intermediate','advance']
    },
    scholarshipAvailabe:{
        type:Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required:true
    }
});

// Static method to get avg of cour tuitions

CourseSchema.statics.getAverageCost = async function(bootcampId){
    const obj = await this.aggregate([
       {
        $match: {bootcamp: bootcampId}
       },
       {
           $group:{
               _id:'$bootcamp',
               averageCost:{ $avg: '$tuition'}
           }
       }

    ]);

    try {
        await this.model('BootCamp').findByIdAndUpdate(bootcampId,{
            averageCost: Math.ceil(obj[0].averageCost /10 ) * 10
        })
    } catch (error) {
        console.error(error);
    }
    
    
}


// Call getAvaregeCost after save
CourseSchema.post('save',function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAvaregeCost before remove
CourseSchema.pre('remove',function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course',CourseSchema);