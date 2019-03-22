from sqlalchemy.ext.automap import automap_base

def get_table(bind, table_name: str):
    """Returns sqlalchemy core table declaration

    Args:
        bind: op.get_bind()
        table_name: str
    """

    base = automap_base()
    base.prepare(bind, reflect = True)
    return getattr(base.classes, table_name).__table__
