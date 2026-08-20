import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Contact } from "./Contact";

describe("Contact", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("requires and submits a mobile number with the saved inquiry", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "Message saved successfully!" }) });
    vi.stubGlobal("fetch", fetchMock);
    const onToast = vi.fn();
    render(<Contact onToast={onToast} />);

    const phone = screen.getByLabelText("Mobile number") as HTMLInputElement;
    expect(phone.type).toBe("tel");
    expect(phone.autocomplete).toBe("tel");
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(phone, { target: { value: "+91 98765 43210" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "I would like to discuss a project." } });
    fireEvent.click(screen.getByRole("button", { name: /save message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({ name: "Ada Lovelace", phone: "+91 98765 43210" });
    expect(onToast).toHaveBeenCalledWith({ kind: "success", message: "Message sent successfully!" });
  });
});
