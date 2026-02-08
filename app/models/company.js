
// module.exports = (sequelize,DataTypes)=>{
//     const Company = sequelize.define('customer',{
//         id:{
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         name:{
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         email:{
//             type:DataTypes.STRING,
//             allowNull:false,
//         },
//         phone_no:{
//             type: DataTypes.INTEGER,
//             allowNull:false
//         }
//     },
//     {
//         tableName: 'customer', //it should  be use table name explecitly
//         timestamps: true, // Automatic add createdAt and updateAt
//         //freezeTableName: true, //this use the table name is as it is means not use plural form
//         underscored: true, // this is use to add underscore , suppose field name in phoneNo  ------> it modified to phone_no
//         paranoid: true // for soft delete , so they can delete the entire row only add timestamp deletedAt column 

//     }
// );
//     return customer;
// }


module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "company",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      legal_company_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      trade_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      cin: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true
      },

      pan: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      country: {
        type: DataTypes.STRING,
        allowNull: true
      },

      industry_type: {
        type: DataTypes.STRING,
        allowNull: true
      },

      contact_person_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true
        // validate: {
        //   isEmail: true
        // }
      },

      phone_no: {
        type: DataTypes.STRING, 
        allowNull: true
      },

      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },

      is_company_profile_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      company_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending"
      },
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        password: {
        type: DataTypes.STRING,
        allowNull: true,
     },

      otp: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "company",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.company_image, {
      foreignKey: "company_id",
      as: "images"
    });
    Company.belongsTo(models.subscription_plan, {
      foreignKey: "subscription_plan_id",
      as: "subscriptionPlan"
    });
  };

  return Company;
};
