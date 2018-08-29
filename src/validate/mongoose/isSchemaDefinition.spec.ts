describe("isSchemaDefinition", () => {
  describe("it should recognize arrays", () => {
    it("arrays should allow arrays of exactly one type", () => {});
  });

  describe("it should recognize SchemaType's", () => {
    it("should recognize SchemaObjectId and Schema.Types.ObjectId", () => {});
    it("should recognize SchemaDate and Schema.Types.Date", () => {});
    it("should recognize SchemaNumber and Schema.Types.Number", () => {});
    it("should recognize SchemaString and Schema.Types.String", () => {});
    it("should recognize SchemaBoolean and Schema.Types.Boolean", () => {});
    it("should recognize SchemaBuffer and Schema.Types.Buffer", () => {});
    it("should recognize SchemaMixed and Schema.Types.Mixed", () => {});
    it("should recognize SchemaDecimal128 and Schema.Types.Decimal128", () => {});
    it("should recognize SchemaDocumentArray and Schema.Types.DocumentArray", () => {});
    it("should recognize SchemaEmbedded and Schema.Types.Embedded", () => {});
    it("should recognize SchemaArray and Schema.Types.Array", () => {});
  });

  describe("it should recognize SchemaTypeOpts", () => {});
});
