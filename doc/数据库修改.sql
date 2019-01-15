

--------wn---------------------
--新建表  topo图属性存储表  t_PM_OneGraph   2018 12 20
CREATE TABLE [dbo].[t_PM_OneGraph] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [PID] int  NOT NULL,
  [OrderNo] int  NOT NULL,
  [Type] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [Path] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [IP] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [Port] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [Account] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [Password] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [Name] nvarchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [UnitID] int  NULL
)
ALTER TABLE [dbo].[t_PM_OneGraph] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'123123',
'SCHEMA', N'dbo',
'TABLE', N't_PM_OneGraph',
'COLUMN', N'Path'
SET IDENTITY_INSERT [dbo].[t_PM_OneGraph] ON
INSERT INTO [dbo].[t_PM_OneGraph] ([ID], [PID], [OrderNo], [Type], [Path], [IP], [Port], [Account], [Password], [Name], [UnitID]) VALUES (N'286', N'1', N'1', N'1', N'1_1_OneGraph.json', N'YWRh', N'YWRh', N'eHc=', N'ZXE=', N'dzxc', NULL)
INSERT INTO [dbo].[t_PM_OneGraph] ([ID], [PID], [OrderNo], [Type], [Path], [IP], [Port], [Account], [Password], [Name], [UnitID]) VALUES (N'287', N'12', N'1', N'1', N'12_1_OneGraph.json', N'NTkuMTEwLjE1My4yMDA=', N'MTU2NzU=', N'd2ViZ3Vlc3Q=', N'IUAjMjMmUWJu', N'高压', NULL)
INSERT INTO [dbo].[t_PM_OneGraph] ([ID], [PID], [OrderNo], [Type], [Path], [IP], [Port], [Account], [Password], [Name], [UnitID]) VALUES (N'288', N'12', N'2', N'1', N'12_2_OneGraph.json', N'NTkuMTEwLjE1My4yMDA=', N'MTU2NzU=', N'd2ViZ3Vlc3Q=', N'IUAjMjMmUWJu', N'低压母线1段', NULL)
INSERT INTO [dbo].[t_PM_OneGraph] ([ID], [PID], [OrderNo], [Type], [Path], [IP], [Port], [Account], [Password], [Name], [UnitID]) VALUES (N'289', N'12', N'3', N'1', N'12_3_OneGraph.json', N'NTkuMTEwLjE1My4yMDA=', N'MTU2NzU=', N'd2ViZ3Vlc3Q=', N'IUAjMjMmUWJu', N'低压母线2段', NULL)
SET IDENTITY_INSERT [dbo].[t_PM_OneGraph] OFF
ALTER TABLE [dbo].[t_PM_OneGraph] ADD CONSTRAINT [PK__t_PM_One__3214EC27E6A1419C] PRIMARY KEY CLUSTERED ([ID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]

--增加字段  异常状态和异常事件  t_DM_CircuitInfo  2018-12-14
alter table  t_DM_CircuitInfo add State int
alter table  t_DM_CircuitInfo add UpDateTime datetime

--增加字段   时间字段  t_DM_CircuitInfo  2018-12-19
alter table  t_CM_PDRInfo add CoordinationTime datetime

--能源管理
--新建表 建筑类型编码表 t_EE_BuildingsType   2018 12 20
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_BuildingsType]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_BuildingsType]
CREATE TABLE [dbo].[t_EE_BuildingsType] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [Remarks] varchar(300) COLLATE Chinese_PRC_CI_AS  NULL
)
ALTER TABLE [dbo].[t_EE_BuildingsType] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'主键',
'SCHEMA', N'dbo',
'TABLE', N't_EE_BuildingsType',
'COLUMN', N'id'
EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N't_EE_BuildingsType',
'COLUMN', N'Name'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_EE_BuildingsType',
'COLUMN', N'Remarks'
SET IDENTITY_INSERT [dbo].[t_EE_BuildingsType] ON
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'1', N'办公建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'2', N'商场建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'3', N'宾馆饭店建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'4', N'文化教育建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'5', N'医疗卫生建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'6', N'体育建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'7', N'综合建筑', N'')
INSERT INTO [dbo].[t_EE_BuildingsType] ([id], [Name], [Remarks]) VALUES (N'8', N'其它建筑（指除上述7种建筑类型外的建筑）', N'')
SET IDENTITY_INSERT [dbo].[t_EE_BuildingsType] OFF
ALTER TABLE [dbo].[t_EE_BuildingsType] ADD CONSTRAINT [BUILSINFTYPEID] UNIQUE NONCLUSTERED ([id] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]

--新建表 空调系统形式 t_EE_coold_syslem_type  2018 12 20
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_coold_syslem_type]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_coold_syslem_type]
CREATE TABLE [dbo].[t_EE_coold_syslem_type] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [Name] varchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [Remarks] varchar(300) COLLATE Chinese_PRC_CI_AS  NULL
)
ALTER TABLE [dbo].[t_EE_coold_syslem_type] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'主键',
'SCHEMA', N'dbo',
'TABLE', N't_EE_coold_syslem_type',
'COLUMN', N'id'
EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N't_EE_coold_syslem_type',
'COLUMN', N'Name'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_EE_coold_syslem_type',
'COLUMN', N'Remarks'
SET IDENTITY_INSERT [dbo].[t_EE_coold_syslem_type] ON
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'1', N'集中式空调系统', N'空调系统的分类')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'2', N'半集中式空调系统（混合式）', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'3', N'立式机组', N'安装方式分类')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'4', N'卧式机组', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'5', N'柱式机组', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'6', N'嵌入式机组', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'7', N'全新风式空调系统', N'按处理空气的方式分类')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'8', N'全封闭式空调系统', N'')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'9', N'回风式空调系统', N'')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'10', N'全空气式空调系统', N'按负担热湿负荷的工作介质分')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'11', N'全水式空调系统', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'12', N'空气-水式空调系统', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'13', N'制冷剂式空调系统', NULL)
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'14', N'定风量系统', N'按系统风量调节方式分类')
INSERT INTO [dbo].[t_EE_coold_syslem_type] ([id], [Name], [Remarks]) VALUES (N'15', N'变风量系统', NULL)
SET IDENTITY_INSERT [dbo].[t_EE_coold_syslem_type] OFF
ALTER TABLE [dbo].[t_EE_coold_syslem_type] ADD CONSTRAINT [COOLDTYPEID] UNIQUE NONCLUSTERED ([id] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]

--增加字段  站点信息表 t_CM_PDRInfo  2018 12 20
alter table  t_CM_PDRInfo add building_type int
alter table  t_CM_PDRInfo add build_year datetime
alter table  t_CM_PDRInfo add build_floor smallint
alter table  t_CM_PDRInfo add build_func nvarchar(100)
alter table  t_CM_PDRInfo add build_area float
alter table  t_CM_PDRInfo add heating_area float
alter table  t_CM_PDRInfo add cool_area float
alter table  t_CM_PDRInfo add build_cool_type int
ALTER TABLE [dbo].[t_CM_PDRInfo] ADD CONSTRAINT [BUILDTYPE] FOREIGN KEY ([building_type]) REFERENCES [dbo].[t_EE_BuildingsType] ([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
ALTER TABLE [dbo].[t_CM_PDRInfo] ADD CONSTRAINT [COOLTYPE] FOREIGN KEY ([build_cool_type]) REFERENCES [dbo].[t_EE_coold_syslem_type] ([id]) ON DELETE NO ACTION ON UPDATE NO ACTION

--新建表 用电项目/分类  t_EE_EnerUserType  2018 12 20
CREATE TABLE [dbo].[t_EE_EnerUserType] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [Name] varchar(100) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [Remarks] varchar(300) COLLATE Chinese_PRC_CI_AS  NULL,
  [item_type] int  NOT NULL
)
ALTER TABLE [dbo].[t_EE_EnerUserType] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'主键',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserType',
'COLUMN', N'id'
EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserType',
'COLUMN', N'Name'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserType',
'COLUMN', N'Remarks'
EXEC sp_addextendedproperty
'MS_Description', N'分项类型',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserType',
'COLUMN', N'item_type'
SET IDENTITY_INSERT [dbo].[t_EE_EnerUserType] ON
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'1', N'建筑总用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'2', N'常规电耗', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'3', N'特殊电耗', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'4', N'照明插座用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'5', N'空调用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'6', N'动力用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'7', N'特殊用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'8', N'走廊和应急照明用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'9', N'室内照明插座用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'10', N'室外景观照明用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'11', N'冷热站用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'12', N'空调末端用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'13', N'电梯用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'14', N'水泵用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'15', N'非空调用通风用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'16', N'非空调用通风用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'17', N'信息中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'18', N'洗衣房', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'19', N'厨房餐厅', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'20', N'游泳池', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'21', N'健身房', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'22', N'专业用途设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'23', N'电开水器', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'24', N'其他特殊用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'25', N'室内照明用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'26', N'室内插座用电', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'27', N'冷热源机组', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'28', N'冷热源机组', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'29', N'冷冻泵及采暖泵', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'30', N'冷却泵', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'31', N'冷却塔', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'32', N'全空气机组及新风机组', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'33', N'风机盘管', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'34', N'分散空间', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'35', N'给排水系统', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'36', N'生活热水热源', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'37', N'信息中心设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'38', N'信息中心专用空调', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'39', N'洗衣服设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'40', N'洗衣房专用空调', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'41', N'厨房餐厅设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'42', N'厨房餐厅专用空调', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'43', N'游泳池设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'44', N'游泳池专用空调', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'45', N'健身房设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'46', N'健身房专用空调', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'47', N'医院医疗设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'48', N'电台通讯设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'49', N'超市冷库', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'50', N'其他专业设备', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'51', N'123', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'52', N'1111', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'53', N'2222222', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'54', N'22', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'55', N'11111', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'56', N'钉钉', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'57', N'呃呃呃', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'58', N'人人人', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'59', N'1', NULL, N'1')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'152', N'脊柱外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'153', N'创伤救治中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'154', N'整形外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'155', N'医疗美容科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'156', N'器官移植科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'157', N'心血管内科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'158', N'心外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'159', N'血管外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'160', N'妇科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'161', N'产科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'162', N'计划生育与生殖医学科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'163', N'女性盆底疾病诊疗中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'174', N'中心实验室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'60', N'2', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'61', N'医院院长', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'62', N'院办', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'63', N'人事科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'64', N'财务科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'65', N'经营办', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'66', N'药剂科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'67', N'机械科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'68', N'总务科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'69', N'审计科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'70', N'网络中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'71', N'图书馆', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'72', N'出入院管理处', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'73', N'核算室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'74', N'保卫科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'75', N'木工班', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'76', N'锅炉房', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'77', N'水电班', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'78', N'业务院长', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'79', N'医务科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'80', N'病案科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'81', N'科教科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'82', N'护理部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'83', N'质控科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'84', N'医保科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'85', N'防保科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'86', N'急救中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'87', N'体检科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'88', N'市场部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'89', N'护士站', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'90', N'供应室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'91', N'血透室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'92', N'临床科室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'93', N'门诊部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'94', N'医技科室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'95', N'急诊室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'96', N'外一科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'97', N'外二科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'98', N'外三科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'99', N'骨科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'100', N'神经外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'101', N'妇产科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'102', N'内科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'103', N'心内科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'104', N'神经内科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'105', N'儿科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'106', N'感染科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'107', N'中医科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'108', N'肿瘤科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'109', N'ICU', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'110', N'手术麻醉科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'111', N'大五官科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'112', N'耳鼻喉科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'113', N'眼科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'114', N'口腔科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'115', N'皮肤科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'116', N'专家门诊', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'117', N'投诉中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'118', N'针灸推拿理疗', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'119', N'换药科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'120', N'超声科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'121', N'检验科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'122', N'输血科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'123', N'放射科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'124', N'CT磁共振科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'125', N'病理科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'126', N'心电图室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'127', N'脑电图室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'128', N'胃镜室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'129', N'医院党委书记', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'130', N'党办', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'131', N'纪检', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'132', N'工会', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'133', N'老干部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'134', N'计划生育办公室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'135', N'团支部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'136', N'消化内室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'137', N'呼吸内室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'138', N'风湿免疫室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'139', N'肾内室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'140', N'内分泌科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'141', N'肝病科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'142', N'老年科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'143', N'肝胆外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'144', N'肠胃外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'145', N'腔镜外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'146', N'胸外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'147', N'泌尿外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'148', N'乳腺外科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'149', N'骨肿瘤科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'150', N'创伤骨科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'151', N'骨关节科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'164', N'康复医学科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'165', N'疼痛医学科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'166', N'重症医学科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'167', N'变态反应科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'168', N'神经科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'169', N'特需医疗部', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'170', N'超声诊断科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'171', N'核医学科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'172', N'放疗科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'173', N'介入诊疗中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'175', N'动物实验室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'176', N'细胞治疗中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'177', N'显微镜实验室', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'178', N'临床营养科', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'179', N'消毒供应中心', NULL, N'2')
INSERT INTO [dbo].[t_EE_EnerUserType] ([id], [Name], [Remarks], [item_type]) VALUES (N'180', N'并案统计室', NULL, N'2')
SET IDENTITY_INSERT [dbo].[t_EE_EnerUserType] OFF

--加字段 回路信息表 t_DM_CircuitInfo  --2018 12 20
alter table  t_DM_CircuitInfo add ener_use_type int

--新建表  用电项目管理  t_EE_EnerUserProject  --2018 12 20
CREATE TABLE [dbo].[t_EE_EnerUserProject] (
  [parent_id] int  NOT NULL,
  [child_id] int  NOT NULL,
  [unit_id] int  NOT NULL,
  [unit_head] nvarchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [unit_note] nvarchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [addCid] nvarchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [delCid] nvarchar(100) COLLATE Chinese_PRC_CI_AS  NULL,
  [unit_area] int  NULL,
  [unit_people] int  NULL
)
ALTER TABLE [dbo].[t_EE_EnerUserProject] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'父节点',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'parent_id'
EXEC sp_addextendedproperty
'MS_Description', N'自身节点',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'child_id'
EXEC sp_addextendedproperty
'MS_Description', N'单位ID',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'unit_id'
EXEC sp_addextendedproperty
'MS_Description', N'负责人',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'unit_head'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'unit_note'
EXEC sp_addextendedproperty
'MS_Description', N'加法表',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'addCid'
EXEC sp_addextendedproperty
'MS_Description', N'减法表',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'delCid'
EXEC sp_addextendedproperty
'MS_Description', N'面积',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'unit_area'
EXEC sp_addextendedproperty
'MS_Description', N'人数',
'SCHEMA', N'dbo',
'TABLE', N't_EE_EnerUserProject',
'COLUMN', N'unit_people'
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'0', N'1', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'152', N'9', N'', N'', N'7,8,9', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'153', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'154', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'155', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'156', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'157', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'158', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'159', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'160', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'161', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'162', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'163', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'174', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'1', N'2', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'1', N'3', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'2', N'4', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'2', N'5', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'2', N'6', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'3', N'7', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'4', N'8', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'4', N'9', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'4', N'10', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'5', N'11', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'5', N'12', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'5', N'13', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'6', N'14', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'6', N'15', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'16', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'17', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'18', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'19', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'20', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'21', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'22', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'7', N'23', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'9', N'24', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'9', N'25', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'11', N'26', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'11', N'27', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'11', N'28', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'12', N'29', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'11', N'30', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'12', N'31', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'12', N'32', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'14', N'33', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'14', N'34', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'16', N'35', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'16', N'36', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'17', N'37', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'17', N'38', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'18', N'40', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'19', N'41', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'19', N'42', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'20', N'43', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'20', N'44', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'21', N'45', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'21', N'46', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'21', N'47', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'21', N'48', N'123', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'0', N'61', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'62', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'63', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'64', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'65', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'66', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'67', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'68', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'69', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'70', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'62', N'71', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'64', N'72', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'65', N'73', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'68', N'74', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'68', N'75', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'68', N'76', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'68', N'77', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'61', N'78', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'79', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'79', N'80', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'81', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'82', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'83', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'84', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'85', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'86', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'87', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'78', N'88', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'82', N'89', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'82', N'90', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'82', N'91', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'79', N'92', N'9', N'', N'', N'7,8,9', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'79', N'93', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'79', N'94', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'95', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'96', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'97', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'98', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'99', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'100', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'101', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'102', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'103', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'104', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'105', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'106', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'107', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'108', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'109', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'110', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'111', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'112', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'113', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'114', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'115', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'116', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'117', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'118', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'93', N'119', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'120', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'121', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'122', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'123', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'124', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'125', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'126', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'127', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'128', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'0', N'129', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'130', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'131', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'132', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'133', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'134', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'129', N'135', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'136', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'137', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'138', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'139', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'140', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'141', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'142', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'143', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'144', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'145', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'146', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'147', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'148', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'149', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'150', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'151', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'164', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'165', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'166', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'167', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'168', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'92', N'169', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'170', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'171', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'172', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'173', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'175', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'176', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'177', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'178', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'179', N'9', N'', N'', N'', N'', N'0', N'0')
INSERT INTO [dbo].[t_EE_EnerUserProject]  VALUES (N'94', N'180', N'9', N'', N'', N'', N'', N'0', N'0')


--新建表 分项类型 t_DM_ItemType 2018 12 21
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_DM_ItemType]') AND type IN ('U'))
	DROP TABLE [dbo].[t_DM_ItemType]
CREATE TABLE [dbo].[t_DM_ItemType] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [Name] varchar(100) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [Remaks] varchar(300) COLLATE Chinese_PRC_CI_AS  NULL
)
ALTER TABLE [dbo].[t_DM_ItemType] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N't_DM_ItemType',
'COLUMN', N'Name'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_DM_ItemType',
'COLUMN', N'Remaks'


--新建表 采集设备分类 t_DM_CollectDevType 2018 12 21
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_DM_CollectDevType]') AND type IN ('U'))
	DROP TABLE [dbo].[t_DM_CollectDevType]
CREATE TABLE [dbo].[t_DM_CollectDevType] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [Name] varchar(100) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [Remaks] varchar(300) COLLATE Chinese_PRC_CI_AS  NULL
)
ALTER TABLE [dbo].[t_DM_ItemType] SET (LOCK_ESCALATION = TABLE)
EXEC sp_addextendedproperty
'MS_Description', N'名称',
'SCHEMA', N'dbo',
'TABLE', N't_DM_CollectDevType',
'COLUMN', N'Name'
EXEC sp_addextendedproperty
'MS_Description', N'备注',
'SCHEMA', N'dbo',
'TABLE', N't_DM_CollectDevType',
'COLUMN', N'Remaks'


-----------zt-------------------
---新建能源预算表------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_Budget]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_Budget]
CREATE TABLE [dbo].[t_EE_Budget](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UID] [int] NULL,-----------单位id
	[Year] [nvarchar](50) NULL,---年份
	[GeneralBudget] [decimal](18, 2) NULL,---计划总预算
	[BudgetBalance] [decimal](18, 2) NULL,----预算余额
	[ActualBudget] [decimal](18, 2) NULL,------实际预算
	[MonthBudget] [decimal](18, 2) NULL,  --------月预算
	[CollTypeID] [int] NULL,----------能源类型ID
	[SubtypeBudget] [decimal](18, 2) NULL,-----分类型预算
	[SubsectorGate] [decimal](18, 2) NULL,-------分部门预算
	[DepartmentalApportionment] [decimal](18, 2) NULL,---分部门分摊预算
 CONSTRAINT [PK_t_EE_Budget] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_enTypeConfig]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
---------新建能源总览配置表-----------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_enTypeConfig]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_enTypeConfig]
CREATE TABLE [dbo].[t_EE_enTypeConfig](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UID] [int] NULL,---单位id
	[UserID] [int] NULL,---用户id
	[CollTypeID] [int] NULL,---能源类型ID
	[EnerUserTypeID] [int] NULL,---部门ID
 CONSTRAINT [PK_t_EE_enTypeConfig] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_ExEnergy]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
----------新建异常用能表
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_ExEnergy]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_ExEnergy]
CREATE TABLE [dbo].[t_EE_ExEnergy](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RecordTime] [datetime] NULL,---时间
	[enerUserTypeID] [int] NULL,----科室ID
	[DID] [int] NULL,---设备ID
	[CID] [int] NULL,---回路ID
	[CODID] [int] NULL,----用能类型ID
	[BudgetEnergy] [decimal](18, 2) NULL,----预测用能
	[ActualEnergy] [decimal](18, 2) NULL,----实际用能
	[Proportion] [decimal](18, 2) NULL,-----异常比例
	[ProportionValue] [decimal](18, 2) NULL,----异常比例阈值
	[Temperature] [decimal](18, 2) NULL,---温度
	[People] [decimal](18, 2) NULL,-----人流量
	[Area] [decimal](18, 2) NULL,----建筑面积
	[Purpose] [nvarchar](max) NULL,---用途
	[Conclusion] [nvarchar](max) NULL,----结论
 CONSTRAINT [PK_t_EE_ExEnergy] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_Exthreshold]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--------新建异常报警阈值表---
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_Exthreshold]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_Exthreshold]
CREATE TABLE [dbo].[t_EE_Exthreshold](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,---名称
	[UpperValue] [decimal](18, 2) NULL,----上限
	[LowerValue] [decimal](18, 2) NULL,----下限
 CONSTRAINT [PK_t_EE_Exthreshold] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_ForecastDaily]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------新建用能预测日表-----
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_ForecastDaily]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_ForecastDaily]
CREATE TABLE [dbo].[t_EE_ForecastDaily](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RecordTime] [datetime] NULL,---时间
	[PID] [int] NULL,---
	[CID] [int] NULL,---
	[ForeUsePower] [decimal](18, 2) NULL,-----用能
 CONSTRAINT [PK_t_EE_ForecastDaily] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_WeatherDaily]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
----天气日表---
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_WeatherDaily]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_WeatherDaily]
CREATE TABLE [dbo].[t_EE_WeatherDaily](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RecordTime] [datetime] NULL,---时间
	[CityCode] [nvarchar](50) NULL,---城市编码
	[CityName] [nvarchar](50) NULL,---城市名称
	[MaxValue] [decimal](18, 2) NULL,----最大值
	[MinValue] [decimal](18, 2) NULL,----最小值
 CONSTRAINT [PK_t_EE_WeatherDaily] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_WeatherMonthly]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------天气月表-----
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_WeatherMonthly]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_WeatherMonthly]
CREATE TABLE [dbo].[t_EE_WeatherMonthly](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RecordTime] [datetime] NULL,
	[CityCode] [nvarchar](50) NULL,
	[CityName] [nvarchar](50) NULL,
	[MaxValue] [decimal](18, 2) NULL,
	[MinValue] [decimal](18, 2) NULL,
 CONSTRAINT [PK_t_EE_WeatherMonthly] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[t_EE_WeatherYearly]    Script Date: 2019/1/15 10:49:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
----天气年表-----
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_EE_WeatherYearly]') AND type IN ('U'))
	DROP TABLE [dbo].[t_EE_WeatherYearly]
CREATE TABLE [dbo].[t_EE_WeatherYearly](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RecordTime] [datetime] NULL,
	[CityCode] [nvarchar](50) NULL,
	[CityName] [nvarchar](50) NULL,
	[MaxValue] [decimal](18, 2) NULL,
	[MinValue] [decimal](18, 2) NULL,
 CONSTRAINT [PK_t_EE_WeatherYearly] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

