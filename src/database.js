const { Sequelize, DataTypes } = require('sequelize');

// Load environment variables
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

const ProcessInstance = sequelize.define('ProcessInstance', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'id_' // Lowercase column name in database
    },
    processDefinitionId: {
      type: DataTypes.STRING,
      field: 'proc_def_id_'
    },
    processInstanceId: {
      type: DataTypes.STRING,
      field: 'proc_inst_id_'
    },
    businessKey: {
      type: DataTypes.STRING,
      field: 'business_key_'
    },
    startTime: {
      type: DataTypes.DATE,
      field: 'start_time_'
    },
    endTime: {
      type: DataTypes.DATE,
      field: 'end_time_'
    },
    duration: {
      type: DataTypes.BIGINT,
      field: 'duration_'
    },
    startUserId: {
      type: DataTypes.STRING,
      field: 'start_user_id_'
    },
    tenantId: {
      type: DataTypes.STRING,
      field: 'tenant_id_'
    }
  }, {
    tableName: 'act_hi_procinst',
    timestamps: false
  });

  const ActivityInstance = sequelize.define('ActivityInstance', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'id_' // Lowercase column name in database
    },
    processInstanceId: {
      type: DataTypes.STRING,
      field: 'proc_inst_id_'
    },
    activityId: {
      type: DataTypes.STRING,
      field: 'act_id_'
    },
    activityName: {
      type: DataTypes.STRING,
      field: 'act_name_'
    },
    activityType: {
      type: DataTypes.STRING,
      field: 'act_type_'
    },
    startTime: {
      type: DataTypes.DATE,
      field: 'start_time_'
    },
    endTime: {
      type: DataTypes.DATE,
      field: 'end_time_'
    },
    tenantId: {
      type: DataTypes.STRING,
      field: 'tenant_id_'
    }
  }, {
    tableName: 'act_hi_actinst',
    timestamps: false
  });

  const VariableInstance = sequelize.define('VariableInstance', {
    id: { type: DataTypes.STRING, primaryKey: true, field: 'id_' },
    processInstanceId: { type: DataTypes.STRING, field: 'proc_inst_id_' },
    activityInstanceId: { type: DataTypes.STRING, field: 'act_inst_id_' },
    variableValue: { type: DataTypes.STRING, field: 'text_' },
    variableDoubleValue: { type: DataTypes.DOUBLE, field: 'double_' },
    variableLongValue: { type: DataTypes.BIGINT, field: 'long_' },
    createTime: { type: DataTypes.DATE, field: 'time_' },
    name: { type: DataTypes.STRING, field: 'name_' },
  }, {
    tableName: 'act_hi_detail',
    timestamps: false
  });

module.exports = { sequelize, ProcessInstance, ActivityInstance, VariableInstance };
