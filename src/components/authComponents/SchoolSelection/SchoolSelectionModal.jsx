import { useState } from "react";
import { Alert, Button, Checkbox, Form, Modal, Select } from "antd";
import { BankOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./SchoolSelectionModal.module.css";

// The parent supplies normalized { value, label } school options and saves the
// selection before allowing the student to continue to their destination.
export default function SchoolSelectionModal({
  open,
  schools = [],
  loading = false,
  loadError = "",
  onRetry,
  onSubmit,
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const school = Form.useWatch("school", form);
  const confirmed = Form.useWatch("confirmed", form);

  const save = async ({ school }) => {
    if (saving) return;
    setSaving(true);
    setSaveError("");
    try {
      await onSubmit(school);
    } catch {
      setSaveError("We couldn’t confirm your school. Please try again. If the problem continues, contact support.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Choose your school"
      className={styles.modal}
      width={560}
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
    >
      <div className={styles.intro}>
        <div className={styles.icon}><BankOutlined aria-hidden="true" /></div>
        <span className={styles.eyebrow}>WELCOME TO MY GUIDANCE</span>
        <h2>Let’s complete your profile</h2>
        <p>Select the school you currently attend to continue to your account.</p>
      </div>

      <div className={styles.notice}>
        <LockOutlined aria-hidden="true" />
        <p><strong>A one-time selection</strong>Please check carefully. Once confirmed, you cannot change your school yourself.</p>
      </div>

      <Form form={form} layout="vertical" onFinish={save} requiredMark={false}>
        <Form.Item name="school" label="Your school" rules={[{ required: true, message: "Please select your school." }]}>
          <Select
            aria-label="Your school"
            size="large"
            showSearch
            options={schools}
            optionFilterProp="label"
            placeholder={loading ? "Loading schools…" : "Search for your school"}
            loading={loading}
            disabled={loading || saving || Boolean(loadError)}
            onChange={() => {
              form.setFieldValue("confirmed", false);
              setSaveError("");
            }}
            notFoundContent={loading ? "Loading schools…" : "No matching schools. Try another name."}
          />
        </Form.Item>

        {loadError && (
          <Alert
            className={styles.error}
            type="error"
            showIcon
            message="Schools could not be loaded"
            description={loadError}
            action={<Button onClick={onRetry} disabled={loading}>Try again</Button>}
          />
        )}
        {saveError && <Alert className={styles.error} type="error" showIcon message={saveError} />}

        <Form.Item name="confirmed" valuePropName="checked" rules={[{
          validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Please confirm that this is your school.")),
        }]}>
          <Checkbox disabled={saving || school == null}>I confirm that this is the school I currently attend.</Checkbox>
        </Form.Item>

        <Button
          className={styles.submit}
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={saving}
          disabled={loading || Boolean(loadError) || school == null || !confirmed}
        >Confirm school & continue</Button>
      </Form>
      <p className={styles.help}>Can’t find your school? <a href="mailto:info@classroomguidance.ie">Contact support</a> for help.</p>
    </Modal>
  );
}
