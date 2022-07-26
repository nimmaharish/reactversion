import React from 'react';
import { useField } from 'formik';
import { OtherButton } from 'components/products/OtherButton';
import { useToggle } from 'hooks/common';
import { useDesktop } from 'contexts';
import { Button, Card, Chip } from 'phoenix-components';
import { ProductVariantDrawer } from 'components/products/ProductVariantDrawer';
import styles from './VariantBlock.module.css';

export function VariantBlock() {
  const isDesktop = useDesktop();
  const [{ value: variants = [] }] = useField('variants');
  const [{ value: colors = [] }] = useField('colors');
  const [openVariants, toggleVariants] = useToggle(false);
  const [open, toggle] = useToggle(variants.length > 0);

  return (
    <>
      {!isDesktop
    && (
      <div className={styles.container}>
        {openVariants && <ProductVariantDrawer onClose={toggleVariants} />}
        <OtherButton onClick={toggle} label="Variants" open={open} />
        {open && (
          <div className={styles.drawer}>
            <div className={styles.buttonContainer}>
              <Button
                onClick={toggleVariants}
                label={(variants.length === 0 && colors.length === 0) ? 'Add Variants' : 'Edit Variants'}
                className={styles.button}
              />
            </div>
            {(variants.length > 0 || colors.length > 0) && (
              <Card className={styles.card}>
                {variants.length > 0 && (
                  <div>
                    <div className={styles.heading}>
                      {variants[0]?.info?.type === 'size' ? 'Size' : (variants[0]?.info?.name ?? 'Custom')}
                    </div>
                    <div className={styles.row}>
                      {variants.map((v, idx) => (
                        <Chip key={idx} label={v?.info?.value} />
                      ))}
                    </div>
                  </div>
                )}
                {colors.length > 0 && (
                  <div>
                    <div className={styles.heading}>
                      Color
                    </div>
                    <div className={styles.row}>
                      {colors.map((c, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: c.hex,
                          }}
                          className={styles.colorBlock}
                        >
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    )}
      {isDesktop
    && (
      <>
        {(variants.length > 0 || colors.length > 0) && (
          <Card className={styles.card}>
            {variants.length > 0 && (
              <div>
                <div className={styles.heading}>
                  {variants[0]?.info?.type === 'size' ? 'Size' : (variants[0]?.info?.name ?? 'Custom')}
                </div>
                <div className={styles.row}>
                  {variants.map((v, idx) => (
                    <Chip key={idx} label={v?.info?.value} />
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div>
                <div className={styles.heading}>
                  Color
                </div>
                <div className={styles.row}>
                  {colors.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: c.hex,
                      }}
                      className={styles.colorBlock}
                    >
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </>
    )}
    </>
  );
}

VariantBlock.propTypes = {};

VariantBlock.defaultProps = {};
