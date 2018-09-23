Create database SectorDB

USE [SectorDB]
GO

CREATE TABLE [dbo].[Customer](
[CustomerId] [int] IDENTITY(1,1) NOT NULL,
[CustomerName] [varchar](50) NOT NULL
) ON [PRIMARY]

CREATE TABLE [dbo].[CustomerSector](
[CustomerId] [int] NOT NULL,
[SectorId] [int] NOT NULL
) ON [PRIMARY]


CREATE TABLE [dbo].[DetailSector](
[DetailSectorID] [int] NULL,
[DetailSectorName] [varchar](50) NOT NULL,
[SubSectorID] [int] NULL
) ON [PRIMARY]

CREATE TABLE [dbo].[MainSector](
[MainSectorID] [int] NULL,
[MainSectorName] [nvarchar](50) NOT NULL
) ON [PRIMARY]

CREATE TABLE [dbo].[SubSector](
[SubSectorId] [int] NULL,
[SubSectorName] [varchar](50) NOT NULL,
[MainSectorSubId] [int] NULL
) ON [PRIMARY]

CREATE PROCEDURE [dbo].[GetCustomer]
	-- Add the parameters for the stored procedure here
	@CustomerName varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	Declare @ID as int

    -- Insert statements for procedure here	
	Select @Id = CustomerId from Customer where CustomerName = @CustomerName

	SELECT distinct SectorId from CustomerSector where CustomerId = @ID
END

CREATE PROCEDURE [dbo].[EditCustomer] 
	@CustomerName varchar(50),
	@Sectors varchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @Id as int

    -- Insert statements for procedure here
	IF exists( select 1 from Customer where CustomerName = @CustomerName)
	BEGIN
		select @Id = CustomerId from Customer where CustomerName = @CustomerName
		delete from CustomerSector where CustomerId in (select CustomerId from Customer where CustomerName = @CustomerName)
	END
	ELSE
	BEGIN
		insert into Customer values(@CustomerName)
		SET @ID = @@IDENTITY
	END
	
	insert into CustomerSector select @ID, * from Tfn_SplitString(@Sectors, ',') 
END


CREATE FUNCTION [dbo].[Tfn_SplitString]
(		
	@Input varchar(max),
	@Delimiter varchar(3) = ','
)
RETURNS @Result table([Value] varchar(max))
AS
BEGIN
	declare @value varchar(max), @lastPos int, @commaPos int = 0

	select @lastPos = @commaPos, @commaPos = charindex(@Delimiter, @Input, @lastPos+1)
		
	while @commaPos > @lastPos
	begin
		select @value = substring(@Input, @lastPos+1, @commaPos-@lastPos-1)
		if @value <> '' 
			insert into @Result select ltrim(rtrim(@value))

		select @lastPos = @commaPos, @commaPos = charindex(@Delimiter, @Input, @lastPos+1)
	end

	select @value = substring(@Input, @lastPos+1, len(@Input))	
	if @value <> ''
		insert into @Result select ltrim(rtrim(@value))	

	return;
END

