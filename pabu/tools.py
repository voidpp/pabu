from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import class_mapper, ColumnProperty
import sqlalchemy.sql.sqltypes
from voluptuous import Schema

def get_table(bind, table_name: str):
    """Returns sqlalchemy core table declaration

    Args:
        bind: op.get_bind()
        table_name: str
    """

    base = automap_base()
    base.prepare(bind, reflect = True)
    return getattr(base.classes, table_name).__table__


def sqla_model_to_voluptuous(model):

    mapping = {
        sqlalchemy.sql.sqltypes.Integer: int,
        sqlalchemy.sql.sqltypes.String: str,
        sqlalchemy.sql.sqltypes.DateTime: str,
    }

    schema_dict = {}

    for prop in class_mapper(model).iterate_properties:
        if not isinstance(prop, ColumnProperty):
            continue
        schema_dict[prop.key] = mapping[type(prop.columns[0].type)]

    return Schema(schema_dict, required = False)
