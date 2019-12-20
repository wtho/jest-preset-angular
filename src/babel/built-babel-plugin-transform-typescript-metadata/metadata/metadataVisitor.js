"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadataVisitor = metadataVisitor;

var _core = require("@babel/core");

var _serializeType = require("./serializeType");

function createMetadataDesignDecorator(design, typeArg) {
  return _core.types.decorator(_core.types.callExpression(_core.types.memberExpression(_core.types.identifier('Reflect'), _core.types.identifier('metadata')), [_core.types.stringLiteral(design), typeArg]));
}

function metadataVisitor(classPath, path) {
  const field = path.node;
  const classNode = classPath.node;

  switch (field.type) {
    case 'ClassMethod':
      const decorators = field.kind === 'constructor' ? classNode.decorators : field.decorators;
      if (!decorators || decorators.length === 0) return;
      decorators.push(createMetadataDesignDecorator('design:type', _core.types.identifier('Function')));
      decorators.push(createMetadataDesignDecorator('design:paramtypes', _core.types.arrayExpression(field.params.map(param => (0, _serializeType.serializeType)(classPath, param))))); // decorators!.push(
      //   createMetadataDesignDecorator(
      //     'design:returntype',
      //     t.arrayExpression(
      //       field.params.map(param => serializeReturnType(classPath, param))
      //     )
      //   )
      // );

      break;

    case 'ClassProperty':
      if (!field.decorators || field.decorators.length === 0) return;
      if (!field.typeAnnotation || field.typeAnnotation.type !== 'TSTypeAnnotation') return;
      field.decorators.push(createMetadataDesignDecorator('design:type', (0, _serializeType.serializeType)(classPath, field)));
      break;
  }
}